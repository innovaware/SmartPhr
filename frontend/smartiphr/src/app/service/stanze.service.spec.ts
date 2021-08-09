import { TestBed } from '@angular/core/testing';

import { StanzeService } from './stanze.service';

describe('StanzeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StanzeService = TestBed.get(StanzeService);
    expect(service).toBeTruthy();
  });
});
