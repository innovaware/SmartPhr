import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLavanderiaComponent } from './dialog-lavanderia.component';

describe('DialogLavanderiaComponent', () => {
  let component: DialogLavanderiaComponent;
  let fixture: ComponentFixture<DialogLavanderiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLavanderiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLavanderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
