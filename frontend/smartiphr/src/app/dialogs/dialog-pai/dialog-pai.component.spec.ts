import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaiComponent } from './dialog-pai.component';

describe('DialogPaiComponent', () => {
  let component: DialogPaiComponent;
  let fixture: ComponentFixture<DialogPaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
