import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAspComponent } from './dialog-asp.component';

describe('DialogAspComponent', () => {
  let component: DialogAspComponent;
  let fixture: ComponentFixture<DialogAspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
