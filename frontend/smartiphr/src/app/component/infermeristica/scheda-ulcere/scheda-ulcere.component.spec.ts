import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaUlcereComponent } from './scheda-ulcere.component';

describe('SchedaUlcereComponent', () => {
  let component: SchedaUlcereComponent;
  let fixture: ComponentFixture<SchedaUlcereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaUlcereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaUlcereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
