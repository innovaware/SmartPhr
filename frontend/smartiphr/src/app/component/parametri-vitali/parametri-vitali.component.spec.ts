import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametriVitaliComponent } from './parametri-vitali.component';

describe('ParametriVitaliComponent', () => {
  let component: ParametriVitaliComponent;
  let fixture: ComponentFixture<ParametriVitaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametriVitaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametriVitaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
