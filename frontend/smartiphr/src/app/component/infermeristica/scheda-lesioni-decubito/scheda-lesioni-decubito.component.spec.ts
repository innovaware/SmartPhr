import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaLesioniDecubitoComponent } from './scheda-lesioni-decubito.component';

describe('SchedaLesioniDecubitoComponent', () => {
  let component: SchedaLesioniDecubitoComponent;
  let fixture: ComponentFixture<SchedaLesioniDecubitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaLesioniDecubitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaLesioniDecubitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
