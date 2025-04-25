import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { CompanyStat, StatCategoryEnum } from '../models/company-stat.model';
import { ResumeData } from '@app/features/resume/models/resume.model';
import { SpecializationEnum } from '@app/features/resume/models/specialization.enum';
import { Comment, CommentCreateRequest, CommentsResponse, CommentVoteRequest } from '@app/features/resume/models/comment.model';

/**
 * Mock API interceptor that returns mock data for specific API endpoints
 * This is only active when environment.useMockApi is true
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only apply mocking if useMockApi is true
  if (!environment.useMockApi) {
    return next(req);
  }

  // Mock the statistics API response
  if (req.url.endsWith('/api/statistics')) {
    return of(
      new HttpResponse<CompanyStat[]>({
        status: 200,
        body: getMockStatisticsData(),
      }),
    );
  }

  // Mock the resumes API response with pagination
  if (req.url.includes('/api/public-users-resumes')) {
    // Get pagination parameters from query string
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const company = url.searchParams.get('company') || '';
    const status = url.searchParams.get('status') || '';
    const specialization = url.searchParams.get('specialization') || '';

    // Generate all the data
    const allData = getMockResumeData();

    // Apply filters if any
    let filteredData = allData;

    if (company) {
      filteredData = filteredData.filter(item =>
        item.companies.some(c =>
          c.name.toLowerCase().includes(company.toLowerCase()),
        ),
      );
    }

    if (status) {
      const statusIsAccepted = status.toLowerCase() === 'accepted';
      filteredData = filteredData.filter(item =>
        item.companies.some(c => c.isHrScreeningPassed === statusIsAccepted),
      );
    }

    if (specialization) {
      filteredData = filteredData.filter(item =>
        item.speciality.toLowerCase().includes(specialization.toLowerCase()),
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Get the current page of data
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Return the paginated response
    return of(
      new HttpResponse<ResumeData[]>({
        status: 200,
        body: paginatedData,
        headers: req.headers.append(
          'X-Total-Count',
          filteredData.length.toString(),
        ),
      }),
    );
  }

  // Add this to the mockApiInterceptor function
  if (req.url.includes('/api/comments/resumes/')) {
    const resumeId = req.url.split('/').pop() || '';
    return of(
      new HttpResponse<CommentsResponse>({
        status: 200,
        body: getMockCommentsData(resumeId),
      }),
    );
  }

  // For comment creation (POST request)
  if (req.url.endsWith('/api/comments') && req.method === 'POST') {
    // Generate a fake response for creating a comment
    return of(
      new HttpResponse<Comment>({
        status: 201,
        body: {
          id: Math.random().toString(36).substring(2, 9), // Generate a random ID
          resumeId: (req.body as CommentCreateRequest).resumeId,
          parentCommentId: (req.body as CommentCreateRequest).parentCommentId,
          text: (req.body as CommentCreateRequest).text,
          authorName: 'Current User',
          authorAvatarUrl: 'assets/images/avatars/avatar-user.png',
          createdAt: new Date().toISOString(),
          reactionsRate: 0,
          userVoteState: 'UNDEFINED'
        }
      })
    );
  }

  // For voting on comments (PATCH request)
  if (req.url.endsWith('/api/comments') && req.method === 'PATCH') {
    // Generate a fake response for voting
    const voteState = (req.body as CommentVoteRequest).voteState;
    return of(
      new HttpResponse<Comment>({
        status: 200,
        body: {
          id: (req.body as CommentVoteRequest).commentId,
          resumeId: 'dummy-resume-id',
          text: 'This comment was voted on',
          authorName: 'Comment Author',
          authorAvatarUrl: 'assets/images/avatars/avatar-1.png',
          createdAt: new Date().toISOString(),
          reactionsRate: voteState === 'UP' ? 1 : -1,
          userVoteState: voteState
        }
      })
    );
  }

  // For any other requests, pass through to the next handler
  return next(req);
};

/**
 * Get mock statistics data for the API
 */
function getMockStatisticsData(): CompanyStat[] {
  return [
    // Most Resume Submissions
    new CompanyStat(
      'Google',
      '2,345',
      'assets/icons/google-icon.svg',
      StatCategoryEnum.SUBMISSIONS,
    ),
    new CompanyStat(
      'Microsoft',
      '1,987',
      'assets/icons/microsoft-icon.svg',
      StatCategoryEnum.SUBMISSIONS,
    ),

    // Highest Acceptance Rate
    new CompanyStat(
      'Apple',
      '68%',
      'assets/icons/apple-icon.svg',
      StatCategoryEnum.ACCEPTANCE,
    ),
    new CompanyStat(
      'Meta',
      '52%',
      'assets/icons/meta-icon.svg',
      StatCategoryEnum.ACCEPTANCE,
    ),

    // Highest Rejection Rate
    new CompanyStat(
      'Amazon',
      '89%',
      'assets/icons/amazon-icon.svg',
      StatCategoryEnum.REJECTION,
    ),
    new CompanyStat(
      'Netflix',
      '82%',
      'assets/icons/netflix-icon.svg',
      StatCategoryEnum.REJECTION,
    ),
  ];
}

/**
 * Get mock resume data for the API
 */
function getMockResumeData(): ResumeData[] {
  // Company names to use in mock data
  const companies = [
    {
      id: 'google',
      name: 'Google',
      logoUrl: 'assets/images/logos/google.png',
    },
    {
      id: 'meta',
      name: 'Meta',
      logoUrl: 'assets/images/logos/meta.png',
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logoUrl: 'assets/images/logos/microsoft.png',
    },
    {
      id: 'apple',
      name: 'Apple',
      logoUrl: 'assets/images/logos/apple.png',
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logoUrl: 'assets/images/logos/amazon.png',
    },
    {
      id: 'netflix',
      name: 'Netflix',
      logoUrl: 'assets/images/logos/netflix.png',
    },
  ];

  // Specializations to use in mock data
  const specializations = [
    SpecializationEnum.FRONTEND,
    SpecializationEnum.BACKEND,
    SpecializationEnum.FULLSTACK,
    SpecializationEnum.MOBILE,
    SpecializationEnum.DEVOPS,
    SpecializationEnum.QA,
    SpecializationEnum.UX_DESIGNER,
    SpecializationEnum.DATA_SCIENTIST,
  ];

  // Generate 25 mock resume items for pagination testing
  return Array.from({ length: 25 }, (_, i) => {
    const authorId = i + 1;
    const companyIndex = i % companies.length;
    const specializationIndex = i % specializations.length;
    const yoe = Math.floor(Math.random() * 10) + 1; // 1-10 years

    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Assign 1-3 random companies to each resume
    const numCompanies = Math.floor(Math.random() * 3) + 1;
    const resumeCompanies = [];
    for (let j = 0; j < numCompanies; j++) {
      const randomCompanyIndex = (companyIndex + j) % companies.length;
      const isHrScreeningPassed = Math.random() > 0.5; // Random boolean

      resumeCompanies.push({
        ...companies[randomCompanyIndex],
        isHrScreeningPassed,
      });
    }

    return {
      id: (i + 1).toString(),
      document: {
        accessType: 'public',
        url: `https://example.com/resume-${i + 1}.pdf`,
        name: `resume-${i + 1}.pdf`,
      },
      companies: resumeCompanies,
      speciality: specializations[specializationIndex],
      yearsOfExperience: yoe,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
    };
  });
}

/**
 * Mock comments data for resume detail pages
 */
function getMockCommentsData(resumeId: string): CommentsResponse {
  // Generate a flat list of comments (no nesting in the response)
  const comments: Comment[] = [
    {
      id: '79268e43-bd4b-4854-895b-cfd758609406',
      resumeId,
      parentCommentId: null,
      text: 'Great resume structure! The experience section is particularly well organized.',
      authorName: 'Alex Johnson',
      authorAvatarUrl: 'assets/images/avatars/avatar-1.png',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      reactionsRate: 14,
      userVoteState: 'UNDEFINED'
    },
    {
      id: '883fcda6-e293-48fa-948d-4676c841f874',
      resumeId,
      parentCommentId: '79268e43-bd4b-4854-895b-cfd758609406',
      text: 'I agree! The clear chronological order makes it easy to follow their career progression.',
      authorName: 'Jamie Smith',
      authorAvatarUrl: 'assets/images/avatars/avatar-2.png',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      reactionsRate: 7,
      userVoteState: 'UNDEFINED'
    },
    {
      id: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d',
      resumeId,
      parentCommentId: '79268e43-bd4b-4854-895b-cfd758609406',
      text: 'Would recommend adding more quantifiable achievements though.',
      authorName: 'Morgan Lee',
      authorAvatarUrl: 'assets/images/avatars/avatar-3.png',
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      reactionsRate: 2,
      userVoteState: 'UNDEFINED'
    },
    {
      id: 'd4e5f6g7-h8i9-4j5k-9l0m-6n7o8p9q0r1',
      resumeId,
      parentCommentId: null,
      text: 'The technical skills section could be more detailed. Consider breaking it down by proficiency levels.',
      authorName: 'Casey Wilson',
      authorAvatarUrl: 'assets/images/avatars/avatar-4.png',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      reactionsRate: 6,
      userVoteState: 'UNDEFINED'
    },
    {
      id: 's2t3u4v5-w6x7-4y8z-9a1b-2c3d4e5f6g7',
      resumeId,
      parentCommentId: null,
      text: 'I interviewed at this company recently. The resume format shown here matches exactly what their HR team prefers.',
      authorName: 'Taylor Brown',
      authorAvatarUrl: 'assets/images/avatars/avatar-5.png',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      reactionsRate: 24,
      userVoteState: 'UNDEFINED'
    },
    {
      id: 'h8i9j0k1-l2m3-4n5o-9p0q-1r2s3t4u5v6',
      resumeId,
      parentCommentId: 's2t3u4v5-w6x7-4y8z-9a1b-2c3d4e5f6g7',
      text: 'Can you share more about their interview process?',
      authorName: 'Alex Johnson',
      authorAvatarUrl: 'assets/images/avatars/avatar-1.png',
      createdAt: new Date(Date.now() - 230400000).toISOString(), // 2.5 days ago
      reactionsRate: 12,
      userVoteState: 'UNDEFINED'
    },
    {
      id: 'v6w7x8y9-z0a1-4b2c-9d3e-4f5g6h7i8j9',
      resumeId,
      parentCommentId: null,
      text: 'The education section should be moved to the bottom since they have significant work experience.',
      authorName: 'Morgan Lee',
      authorAvatarUrl: 'assets/images/avatars/avatar-3.png',
      createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      reactionsRate: 2,
      userVoteState: 'UNDEFINED'
    }
  ];

  return {
    data: comments,
    totalCount: comments.length
  };
}
