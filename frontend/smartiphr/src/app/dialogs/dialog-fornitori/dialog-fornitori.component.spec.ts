import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFornitoriComponent } from './dialog-fornitori.component';

describe('DialogFornitoriComponent', () => {
  let component: DialogFornitoriComponent;
  let fixture: ComponentFixture<DialogFornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
