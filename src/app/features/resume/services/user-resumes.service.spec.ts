/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserResumesService } from './user-resumes.service';

describe('Service: UserResumes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserResumesService]
    });
  });

  it('should ...', inject([UserResumesService], (service: UserResumesService) => {
    expect(service).toBeTruthy();
  }));
});
