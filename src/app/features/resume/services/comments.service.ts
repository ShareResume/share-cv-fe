import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Comment {
  id: string;
  resumeId: string;
  parentCommentId?: string;
  text: string;
  authorName: string;
  authorAvatarUrl: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVoteState?: 'UP' | 'DOWN' | null;
  replies?: Comment[];
}

export interface CommentCreateRequest {
  resumeId: string;
  parentCommentId?: string;
  text: string;
}

export interface CommentVoteRequest {
  commentId: string;
  voteState: 'UP' | 'DOWN';
}

export interface CommentsResponse {
  data: Comment[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/api/comments`;

  getCommentsByResumeId(resumeId: string): Observable<CommentsResponse> {
    return this.http.get<CommentsResponse>(`${this.apiUrl}/resumes/${resumeId}`);
  }

  createComment(comment: CommentCreateRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}`, comment);
  }

  voteOnComment(vote: CommentVoteRequest): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}`, vote);
  }
} 