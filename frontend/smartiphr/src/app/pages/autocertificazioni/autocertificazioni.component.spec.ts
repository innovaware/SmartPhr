import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocertificazioniComponent } from './autocertificazioni.component';


describe('AutocertificazioniComponent', () => {
  let component: AutocertificazioniComponent;
  let fixture: ComponentFixture<AutocertificazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocertificazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocertificazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
