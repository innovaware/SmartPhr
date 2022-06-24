import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModulisticaPazienteComponent } from './dialog-modulistica-paziente.component';

describe('DialogModulisticaPazienteComponent', () => {
  let component: DialogModulisticaPazienteComponent;
  let fixture: ComponentFixture<DialogModulisticaPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModulisticaPazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModulisticaPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
