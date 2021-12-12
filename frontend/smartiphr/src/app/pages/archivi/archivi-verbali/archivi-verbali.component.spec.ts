import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviVerbaliComponent } from './archivi-verbali.component';

describe('ArchiviVerbaliComponent', () => {
  let component: ArchiviVerbaliComponent;
  let fixture: ComponentFixture<ArchiviVerbaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviVerbaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviVerbaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
