import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaLesioniCutaneeComponent } from './scheda-lesioni-cutanee.component';

describe('SchedaLesioniCutaneeComponent', () => {
  let component: SchedaLesioniCutaneeComponent;
  let fixture: ComponentFixture<SchedaLesioniCutaneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaLesioniCutaneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaLesioniCutaneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
