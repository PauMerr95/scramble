import { TestBed } from '@angular/core/testing';

import { Motions } from './motions';

describe('Motions', () => {
  let service: Motions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Motions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
