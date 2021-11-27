import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsitiStrumentaliComponent } from './esiti-strumentali.component';

describe('EsitiStrumentaliComponent', () => {
  let component: EsitiStrumentaliComponent;
  let fixture: ComponentFixture<EsitiStrumentaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsitiStrumentaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsitiStrumentaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
