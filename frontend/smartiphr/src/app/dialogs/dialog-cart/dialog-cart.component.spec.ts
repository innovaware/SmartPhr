import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartComponent } from './dialog-cart.component';

describe('DialogCartComponent', () => {
  let component: DialogCartComponent;
  let fixture: ComponentFixture<DialogCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
