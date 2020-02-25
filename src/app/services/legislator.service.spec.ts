import { TestBed } from '@angular/core/testing';

import { LegislatorService } from './legislator.service';

describe('LegislatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegislatorService = TestBed.get(LegislatorService);
    expect(service).toBeTruthy();
  });
});
