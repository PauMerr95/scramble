import { TestBed } from '@angular/core/testing';

import { MotionService } from './motion-service';

describe('Motions', () => {
  let service: MotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
