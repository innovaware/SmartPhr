import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaBAIComponent } from './scheda-bai.component';

describe('SchedaBAIComponent', () => {
  let component: SchedaBAIComponent;
  let fixture: ComponentFixture<SchedaBAIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaBAIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaBAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
