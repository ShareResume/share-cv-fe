import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '@environments/environment';
import { Bookmark, BookmarkResponse } from '../models/bookmark.model';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private httpClient = inject(HttpClient);
  private readonly apiEndpoint = '/user-favorites-resumes';
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Get all bookmarks for the current user
   */
  getBookmarks(): Observable<BookmarkResponse> {
    return this.httpClient.get<any[]>(
      `${this.baseUrl}${this.apiEndpoint}`,
      { observe: 'response' }
    ).pipe(
      map(response => {
        let totalCount = response.body?.length || 0;
        
        // Try to get the total count from the X-Total-Count header
        const totalCountHeader = response.headers.get('X-Total-Count');

        if (totalCountHeader) {
          const count = parseInt(totalCountHeader, 10);

          if (!isNaN(count)) {
            totalCount = count;
          }
        }
        
        // Transform the data
        const data = response.body 
          ? response.body.map(item => Bookmark.fromJson(item))
          : [];
        
        return {
          data,
          totalCount,
        };
      }),
      catchError(error => {
        console.error('Error fetching bookmarks:', error);
        return of({ data: [], totalCount: 0 });
      })
    );
  }

  /**
   * Add a resume to bookmarks
   */
  addBookmark(resumeId: string): Observable<Bookmark> {
    return this.httpClient.post<any>(
      `${this.baseUrl}${this.apiEndpoint}`,
      { resumeId }
    ).pipe(
      map(response => Bookmark.fromJson(response)),
      catchError(error => {
        console.error('Error adding bookmark:', error);
        throw error;
      })
    );
  }

  /**
   * Remove a resume from bookmarks
   */
  removeBookmark(resumeId: string): Observable<boolean> {
    return this.httpClient.delete(
      `${this.baseUrl}${this.apiEndpoint}/${resumeId}`,
      { observe: 'response' }
    ).pipe(
      map(response => response.status === 200 || response.status === 204),
      catchError(error => {
        console.error('Error removing bookmark:', error);
        return of(false);
      })
    );
  }

  /**
   * Check if a resume is bookmarked
   */
  isBookmarked(resumeId: string): Observable<boolean> {
    return this.getBookmarks().pipe(
      map(response => response.data.some(bookmark => bookmark.resumeId === resumeId)),
      catchError(error => {
        console.error('Error checking bookmark status:', error);
        return of(false);
      })
    );
  }
} 