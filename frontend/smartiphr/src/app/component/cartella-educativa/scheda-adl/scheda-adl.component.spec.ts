import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaADLComponent } from './scheda-adl.component';

describe('SchedaADLComponent', () => {
  let component: SchedaADLComponent;
  let fixture: ComponentFixture<SchedaADLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaADLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaADLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
