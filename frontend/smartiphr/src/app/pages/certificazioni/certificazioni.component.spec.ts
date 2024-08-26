import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificazioniComponent } from './certificazioni.component';


describe('CertificazioniComponent', () => {
  let component: CertificazioniComponent;
  let fixture: ComponentFixture<CertificazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
