import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment, CommentCreateRequest, CommentsService } from '../../services/comments.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../../reusable/button/button.component';

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
    ButtonComponent
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

  // For new comments with a parent
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
          this.comments.set(response.data);
          this.isLoadingComments.set(false);
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
        next: (comment) => {
          // Update comments list
          if (this.replyingToComment()) {
            // If this is a reply, find the parent comment and add this as a reply
            this.comments.update(comments => 
              comments.map(c => {
                if (c.id === this.replyingToComment()?.id) {
                  return {
                    ...c,
                    replies: [...(c.replies || []), comment]
                  };
                }
                return c;
              })
            );
            this.cancelReply();
          } else {
            // Add as a new top-level comment
            this.comments.update(comments => [comment, ...comments]);
          }
          // Reset form
          this.commentForm.reset();
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
  
  voteOnComment(comment: Comment, voteState: 'UP' | 'DOWN'): void {
    // Toggle vote off if already voted the same way
    const newVoteState = comment.userVoteState === voteState ? null : voteState;
    
    this.commentsService.voteOnComment({
      commentId: comment.id,
      voteState: voteState
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (updatedComment) => {
        // Update the comments list with the updated vote counts
        this.comments.update(comments => 
          comments.map(c => {
            if (c.id === updatedComment.id) {
              return updatedComment;
            }
            return c;
          })
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error voting on comment:', error);
      }
    });
  }
  
  updateSort(sort: string): void {
    this.selectedSort.set(sort);
    
    // Reorder comments based on sort option
    this.comments.update(comments => {
      return [...comments].sort((a, b) => {
        if (this.selectedSort() === 'Most Helpful') {
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        } else if (this.selectedSort() === 'Newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else { // Oldest
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      });
    });
  }
} 