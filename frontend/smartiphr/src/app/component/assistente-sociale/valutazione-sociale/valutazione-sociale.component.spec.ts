import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneSocialeComponent } from './valutazione-sociale.component';

describe('ValutazioneSocialeComponent', () => {
  let component: ValutazioneSocialeComponent;
  let fixture: ComponentFixture<ValutazioneSocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValutazioneSocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutazioneSocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
