import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCvComponent } from './dialog-cv.component';

describe('DialogCvComponent', () => {
  let component: DialogCvComponent;
  let fixture: ComponentFixture<DialogCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
