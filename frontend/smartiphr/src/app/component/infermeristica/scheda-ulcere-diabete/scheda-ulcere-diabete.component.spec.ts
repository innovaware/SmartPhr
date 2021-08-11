import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaUlcereDiabeteComponent } from './scheda-ulcere-diabete.component';

describe('SchedaUlcereDiabeteComponent', () => {
  let component: SchedaUlcereDiabeteComponent;
  let fixture: ComponentFixture<SchedaUlcereDiabeteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaUlcereDiabeteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaUlcereDiabeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
