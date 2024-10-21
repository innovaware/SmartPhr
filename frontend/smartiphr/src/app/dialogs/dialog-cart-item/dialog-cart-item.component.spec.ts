import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartItemComponent } from './dialog-cart-item.component';

describe('DialogCartItemComponent', () => {
  let component: DialogCartItemComponent;
  let fixture: ComponentFixture<DialogCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogCartItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
