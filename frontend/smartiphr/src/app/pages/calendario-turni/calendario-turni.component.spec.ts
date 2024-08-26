import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTurniComponent } from './calendario-turni.component';

describe('DashboardComponent', () => {
  let component: CalendarioTurniComponent;
  let fixture: ComponentFixture<CalendarioTurniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioTurniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioTurniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
