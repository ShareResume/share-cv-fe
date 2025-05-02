import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comment, CommentCreateRequest, CommentsResponse, CommentVoteRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/comments`;

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