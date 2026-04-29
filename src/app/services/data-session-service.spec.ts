import { TestBed } from '@angular/core/testing';

import { DataSessionService } from './data-session-service';

describe('DataSessionService', () => {
  let service: DataSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('method "parseFasta" works as expected', () => {
    // TODO: Create Test
  });

  it('method "search" works as expected', () => {
    // TODO: Create Test
  });
});
