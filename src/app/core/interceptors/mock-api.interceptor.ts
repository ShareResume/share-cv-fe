import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { CompanyStat, StatCategoryEnum } from '../models/company-stat.model';
import { ResumeData } from '@app/features/resume/models/resume.model';
import { SpecializationEnum } from '@app/features/resume/models/specialization.enum';

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
  if (req.url.includes('/api/resumes')) {
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
          c.name.toLowerCase().includes(company.toLowerCase())
        ),
      );
    }

    if (status) {
      filteredData = filteredData.filter(
        item => item.isHrScreeningPassed === (status.toLowerCase() === 'accepted'),
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
    SpecializationEnum.DATA_SCIENTIST
  ];

  // Generate 25 mock resume items for pagination testing
  return Array.from({ length: 25 }, (_, i) => {
    const authorId = i + 1;
    const companyIndex = i % companies.length;
    const specializationIndex = i % specializations.length;
    const isHrScreeningPassed = i % 2 === 0; // Alternate between passed and not passed
    const yoe = Math.floor(Math.random() * 10) + 1; // 1-10 years

    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Assign 1-3 random companies to each resume
    const numCompanies = Math.floor(Math.random() * 3) + 1;
    const resumeCompanies = [];
    for (let j = 0; j < numCompanies; j++) {
      const randomCompanyIndex = (companyIndex + j) % companies.length;
      resumeCompanies.push(companies[randomCompanyIndex]);
    }

    return {
      id: (i + 1).toString(),
      document: {
        accessType: 'public',
        url: `https://example.com/resume-${i + 1}.pdf`,
        name: `resume-${i + 1}.pdf`
      },
      companies: resumeCompanies,
      speciality: specializations[specializationIndex],
      isHrScreeningPassed: isHrScreeningPassed,
      yearsOfExperience: yoe,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
    };
  });
}
