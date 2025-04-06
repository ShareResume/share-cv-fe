import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
import { CompanyStat, StatCategoryEnum } from '../models/company-stat.model';

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
    return of(new HttpResponse<CompanyStat[]>({
      status: 200,
      body: getMockStatisticsData()
    }));
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
    new CompanyStat('Google', '2,345', 'assets/icons/google-icon.svg', StatCategoryEnum.SUBMISSIONS),
    new CompanyStat('Microsoft', '1,987', 'assets/icons/microsoft-icon.svg', StatCategoryEnum.SUBMISSIONS),
    
    // Highest Acceptance Rate
    new CompanyStat('Apple', '68%', 'assets/icons/apple-icon.svg', StatCategoryEnum.ACCEPTANCE),
    new CompanyStat('Meta', '52%', 'assets/icons/meta-icon.svg', StatCategoryEnum.ACCEPTANCE),
    
    // Highest Rejection Rate
    new CompanyStat('Amazon', '89%', 'assets/icons/amazon-icon.svg', StatCategoryEnum.REJECTION),
    new CompanyStat('Netflix', '82%', 'assets/icons/netflix-icon.svg', StatCategoryEnum.REJECTION)
  ];
} 