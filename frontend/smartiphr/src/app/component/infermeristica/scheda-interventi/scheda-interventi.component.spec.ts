import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaInterventiComponent } from './scheda-interventi.component';

describe('SchedaInterventiComponent', () => {
  let component: SchedaInterventiComponent;
  let fixture: ComponentFixture<SchedaInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
