import { TestBed } from '@angular/core/testing';

import { ComponentcommunicationService } from './componentcommunication.service';

describe('ComponentcommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentcommunicationService = TestBed.get(ComponentcommunicationService);
    expect(service).toBeTruthy();
  });
});
