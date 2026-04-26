import { TestBed } from '@angular/core/testing';

import { SequenceViewerService } from './sequence-viewer-service';

describe('SequenceViewerService', () => {
  let service: SequenceViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequenceViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
