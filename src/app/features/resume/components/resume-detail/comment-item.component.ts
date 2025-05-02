import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../../reusable/button/button.component';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    ButtonComponent,
    NgClass,
    NgFor,
    NgIf
  ]
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  @Input() replyingToId: string | null = null;
  @Input() level: number = 0;
  @Input() isFirstReply: boolean = false;
  
  @Output() vote = new EventEmitter<{comment: Comment, voteState: 'UP' | 'DOWN'}>();
  @Output() replyClick = new EventEmitter<Comment>();
  @Output() submitReply = new EventEmitter<{parentId: string, text: string}>();
  @Output() cancelReplyEvent = new EventEmitter<void>();
  
  commentForm = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  
  get isReplyingToThisComment(): boolean {
    return this.replyingToId === this.comment.id;
  }
  
  handleVote(comment: Comment, voteState: 'UP' | 'DOWN'): void {
    this.vote.emit({ comment, voteState });
  }
  
  replyToComment(comment: Comment): void {
    this.replyClick.emit(comment);
  }
  
  submitComment(): void {
    if (this.commentForm.invalid) {
      return;
    }
    
    this.submitReply.emit({
      parentId: this.comment.id,
      text: this.commentForm.get('text')?.value || ''
    });
    
    this.commentForm.reset();
  }
  
  cancelReply(): void {
    this.cancelReplyEvent.emit();
    this.commentForm.reset();
  }
} 