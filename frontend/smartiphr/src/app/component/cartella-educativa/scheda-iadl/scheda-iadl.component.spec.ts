import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaIADLComponent } from './scheda-iadl.component';

describe('SchedaIADLComponent', () => {
  let component: SchedaIADLComponent;
  let fixture: ComponentFixture<SchedaIADLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaIADLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaIADLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
