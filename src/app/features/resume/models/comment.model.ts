export interface Comment {
  id: string;
  resumeId: string;
  parentCommentId?: string | null;
  text: string;
  authorName: string;
  authorAvatarUrl: string;
  createdAt: string;
  reactionsRate: number;
  userVoteState?: 'UP' | 'DOWN' | 'UNDEFINED' | null;
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
