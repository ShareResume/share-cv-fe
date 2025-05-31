import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../../reusable/button/button.component';
import { CommentsService } from '../../services/comments.service';
import { Comment, CommentCreateRequest, CommentVoteRequest } from '../../models/comment.model';
import { CommentItemComponent } from './comment-item.component';

interface CommentForm {
  text: FormControl<string>;
}

@Component({
  selector: 'app-resume-detail-comments',
  templateUrl: './resume-detail-comments.component.html',
  styleUrl: './resume-detail-comments.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    ButtonComponent,
    NgFor,
    NgIf,
    NgClass,
    CommentItemComponent
  ]
})
export class ResumeDetailCommentsComponent implements OnChanges {
  private commentsService = inject(CommentsService);
  private destroyRef = inject(DestroyRef);

  @Input() resumeId: string | null = null;

  comments = signal<Comment[]>([]);
  isLoadingComments = signal<boolean>(false);
  commentsError = signal<string | null>(null);
  
  commentForm = new FormGroup<CommentForm>({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  replyingToComment = signal<Comment | null>(null);
  
  sortOptions = ['Most Helpful', 'Newest', 'Oldest'];
  selectedSort = signal<string>('Most Helpful');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resumeId'] && this.resumeId) {
      this.loadComments(this.resumeId);
    }
  }
  
  loadComments(resumeId: string): void {
    this.isLoadingComments.set(true);
    this.commentsError.set(null);
    
    this.commentsService.getCommentsByResumeId(resumeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const flatComments = Array.isArray(response) ? response : (response?.data || []);
          
          const commentMap = new Map<string, Comment>();
          const rootComments: Comment[] = [];
          
          flatComments.forEach(comment => {
            // Ensure the comment has a replies array
            comment.replies = [];
            commentMap.set(comment.id, comment);
          });
          
          flatComments.forEach(comment => {
            if (comment.parentCommentId) {
              const parentComment = commentMap.get(comment.parentCommentId);
              if (parentComment) {
                if (!parentComment.replies) {
                  parentComment.replies = [];
                }
                parentComment.replies.push(comment);
              } else {
                rootComments.push(comment);
              }
            } else {
              rootComments.push(comment);
            }
          });
          
          this.comments.set(rootComments);
          this.isLoadingComments.set(false);
          
          this.updateSort(this.selectedSort());
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading comments:', error);
          this.commentsError.set('Failed to load comments. Please try again.');
          this.isLoadingComments.set(false);
        }
      });
  }
  
  submitComment(): void {
    if (this.commentForm.invalid || !this.resumeId) {
      return;
    }
    
    const newComment: CommentCreateRequest = {
      resumeId: this.resumeId,
      text: this.commentForm.controls.text.value,
      parentCommentId: this.replyingToComment()?.id
    };
    
    this.commentsService.createComment(newComment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Reset form
          this.commentForm.reset();
          this.cancelReply();
          
          // Refresh comments
          if (this.resumeId) {
            this.loadComments(this.resumeId);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error posting comment:', error);
        }
      });
  }
  
  replyToComment(comment: Comment): void {
    this.replyingToComment.set(comment);
  }
  
  cancelReply(): void {
    this.replyingToComment.set(null);
    this.commentForm.reset();
  }
  
  // Handler for vote events from comment-item component
  handleVote(event: {comment: Comment, voteState: 'UP' | 'DOWN'}): void {
    const { comment, voteState } = event;
    this.commentsService.voteOnComment({
      commentId: comment.id,
      voteState: voteState
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        // Refresh comments to get updated vote counts
        if (this.resumeId) {
          this.loadComments(this.resumeId);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error voting on comment:', error);
      }
    });
  }
  
  // Handler for reply submission from nested comments
  handleSubmitReply(event: {parentId: string, text: string}): void {
    if (!this.resumeId) {
      return;
    }
    
    const newComment: CommentCreateRequest = {
      resumeId: this.resumeId,
      text: event.text,
      parentCommentId: event.parentId
    };
    
    this.commentsService.createComment(newComment)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cancelReply();
          
          // Refresh comments
          if (this.resumeId) {
            this.loadComments(this.resumeId);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error posting reply:', error);
        }
      });
  }
  
  updateSort(sort: string): void {
    this.selectedSort.set(sort);
    
    // Reorder comments based on sort option
    this.comments.update(rootComments => {
      const sortFunction = (a: Comment, b: Comment) => {
        if (this.selectedSort() === 'Most Helpful') {
          return b.reactionsRate - a.reactionsRate;
        } else if (this.selectedSort() === 'Newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else { // Oldest
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      };
      
      // Sort root comments
      const sortedRoots = [...rootComments].sort(sortFunction);
      
      // Recursively sort child comments
      const sortReplies = (replies: Comment[]) => {
        if (!replies || replies.length === 0) return [];
        
        const sortedReplies = [...replies].sort(sortFunction);
        sortedReplies.forEach(reply => {
          if (reply.replies && reply.replies.length > 0) {
            reply.replies = sortReplies(reply.replies);
          }
        });
        
        return sortedReplies;
      };
      
      // Apply sorting to all replies
      sortedRoots.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = sortReplies(comment.replies);
        }
      });
      
      return sortedRoots;
    });
  }
} 