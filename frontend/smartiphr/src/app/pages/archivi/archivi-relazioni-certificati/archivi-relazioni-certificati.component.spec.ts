import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviRelazioniCertificatiComponent } from './archivi-relazioni-certificati.component';

describe('ArchiviRelazioniCertificatiComponent', () => {
  let component: ArchiviRelazioniCertificatiComponent;
  let fixture: ComponentFixture<ArchiviRelazioniCertificatiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviRelazioniCertificatiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviRelazioniCertificatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
