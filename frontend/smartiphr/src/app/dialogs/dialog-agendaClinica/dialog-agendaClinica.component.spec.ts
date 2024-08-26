import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgendaClinicaComponent } from './dialog-agendaClinica.component';

describe('DialogAgendaClinicaComponent', () => {
  let component: DialogAgendaClinicaComponent;
  let fixture: ComponentFixture<DialogAgendaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAgendaClinicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgendaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
