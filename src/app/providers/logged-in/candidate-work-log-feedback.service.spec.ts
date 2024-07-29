import { TestBed } from '@angular/core/testing';

import { CandidateWorkLogFeedbackService } from './candidate-work-log-feedback.service';

describe('CandidateWorkLogFeedbackService', () => {
  let service: CandidateWorkLogFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateWorkLogFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
