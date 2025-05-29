/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserResumesService } from './user-resumes.service';

describe('Service: UserResumes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserResumesService]
    });
  });

  it('should create service', inject([UserResumesService], (service: UserResumesService) => {
    expect(service).toBeTruthy();
  }));
});
