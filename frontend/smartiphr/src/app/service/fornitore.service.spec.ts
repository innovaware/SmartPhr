import { TestBed } from '@angular/core/testing';

import { FornitoreService } from './fornitore.service';

describe('FornitoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FornitoreService = TestBed.get(FornitoreService);
    expect(service).toBeTruthy();
  });
});