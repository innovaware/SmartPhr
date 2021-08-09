import { TestBed } from '@angular/core/testing';

import { UtentiService } from './utenti.service';

describe('UtentiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtentiService = TestBed.get(UtentiService);
    expect(service).toBeTruthy();
  });
});
