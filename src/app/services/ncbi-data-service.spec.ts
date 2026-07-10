import { TestBed } from '@angular/core/testing';

import { NcbiDataService } from './ncbi-data-service';

describe('NcbiDataService', () => {
  let service: NcbiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NcbiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
