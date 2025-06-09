import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePageComponent } from './profile-page.component';
import { BookmarkService } from '@app/core/services/bookmark.service';
import { ResumeService } from '@app/features/resume/services/resume.service';
import { UserResumesService } from '@app/features/resume/services/user-resumes.service';
import { ToasterService } from '@app/core/services/toaster.service';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let mockBookmarkService: jasmine.SpyObj<BookmarkService>;
  let mockResumeService: jasmine.SpyObj<ResumeService>;
  let mockUserResumesService: jasmine.SpyObj<UserResumesService>;
  let mockToasterService: jasmine.SpyObj<ToasterService>;

  beforeEach(async () => {
    const bookmarkServiceSpy = jasmine.createSpyObj('BookmarkService', ['getBookmarks', 'removeBookmark']);
    const resumeServiceSpy = jasmine.createSpyObj('ResumeService', ['getResume']);
    const userResumesServiceSpy = jasmine.createSpyObj('UserResumesService', ['getResumes']);
    const toasterServiceSpy = jasmine.createSpyObj('ToasterService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        { provide: BookmarkService, useValue: bookmarkServiceSpy },
        { provide: ResumeService, useValue: resumeServiceSpy },
        { provide: UserResumesService, useValue: userResumesServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy }
      ]
    }).compileComponents();

    mockBookmarkService = TestBed.inject(BookmarkService) as jasmine.SpyObj<BookmarkService>;
    mockResumeService = TestBed.inject(ResumeService) as jasmine.SpyObj<ResumeService>;
    mockUserResumesService = TestBed.inject(UserResumesService) as jasmine.SpyObj<UserResumesService>;
    mockToasterService = TestBed.inject(ToasterService) as jasmine.SpyObj<ToasterService>;

    // Setup default mock responses
    mockBookmarkService.getBookmarks.and.returnValue(of({ data: [], totalCount: 0 }));
    mockUserResumesService.getResumes.and.returnValue(of([]));

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bookmarks and resumes on init', () => {
    expect(mockBookmarkService.getBookmarks).toHaveBeenCalled();
    expect(mockUserResumesService.getResumes).toHaveBeenCalled();
  });
}); 