import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPresidioPazienteComponent } from './dialog-presidio-paziente.component';

describe('DialogPresidioPazienteComponent', () => {
  let component: DialogPresidioPazienteComponent;
  let fixture: ComponentFixture<DialogPresidioPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPresidioPazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPresidioPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
