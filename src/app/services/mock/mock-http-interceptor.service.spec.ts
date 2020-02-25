import { TestBed } from '@angular/core/testing';

import { MockHttpInterceptorService } from './mock-http-interceptor.service';

describe('MockHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockHttpInterceptorService = TestBed.get(MockHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
