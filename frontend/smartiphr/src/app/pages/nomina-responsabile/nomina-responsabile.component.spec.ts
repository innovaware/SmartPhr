import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NominaResponsabileComponent } from './nomina-responsabile.component';


describe('NominaResponsabileComponent', () => {
  let component: NominaResponsabileComponent;
  let fixture: ComponentFixture<NominaResponsabileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NominaResponsabileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NominaResponsabileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
