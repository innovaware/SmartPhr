import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMessageErrorComponent } from './dialog-message-error.component';

describe('DialogMessageErrorComponent', () => {
  let component: DialogMessageErrorComponent;
  let fixture: ComponentFixture<DialogMessageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMessageErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMessageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
