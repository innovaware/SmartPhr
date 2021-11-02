import { HttpClientModule } from "@angular/common/http";
import { inject, TestBed } from "@angular/core/testing";
import { Contratto } from "../models/contratto";

import { ContrattoService } from "./contratto.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

describe("ContrattoService", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ContrattoService],
    });
  });

  it("should be created", () => {
    const service: ContrattoService = TestBed.get(ContrattoService);
    expect(service).toBeTruthy();
  });

});
