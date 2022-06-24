import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPresidiPazienteComponent } from './dialog-presidi-paziente.component';

describe('DialogPresidiPazienteComponent', () => {
  let component: DialogPresidiPazienteComponent;
  let fixture: ComponentFixture<DialogPresidiPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPresidiPazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPresidiPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
