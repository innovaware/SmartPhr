import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMenuPersonalizzatoComponent } from './dialog-menu-personalizzato.component';

describe('DialogMenuPersonalizzatoComponent', () => {
  let component: DialogMenuPersonalizzatoComponent;
  let fixture: ComponentFixture<DialogMenuPersonalizzatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMenuPersonalizzatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMenuPersonalizzatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
