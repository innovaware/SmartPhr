import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaClinicaComponent } from './agendaClinica.component';



describe('AgendaClinicaComponent', () => {
  let component: AgendaClinicaComponent;
  let fixture: ComponentFixture<AgendaClinicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaClinicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
