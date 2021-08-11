import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaVASComponent } from './scheda-vas.component';

describe('SchedaVASComponent', () => {
  let component: SchedaVASComponent;
  let fixture: ComponentFixture<SchedaVASComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaVASComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaVASComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
