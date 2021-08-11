import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaMNARComponent } from './scheda-mnar.component';

describe('SchedaMNARComponent', () => {
  let component: SchedaMNARComponent;
  let fixture: ComponentFixture<SchedaMNARComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaMNARComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaMNARComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
