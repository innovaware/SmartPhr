import { TestBed } from '@angular/core/testing';

import { ContrattoService } from './contratto.service';

describe('ContrattoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContrattoService = TestBed.get(ContrattoService);
    expect(service).toBeTruthy();
  });
});
