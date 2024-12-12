import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RifiutiSpecialiComponent } from './rifiutiSpeciali.component';

describe('RifiutiSpecialiComponent', () => {
  let component: RifiutiSpecialiComponent;
  let fixture: ComponentFixture<RifiutiSpecialiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RifiutiSpecialiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RifiutiSpecialiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
