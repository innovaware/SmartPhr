import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPazienteComponent } from './dialog-paziente.component';

describe('DialogPazienteComponent', () => {
  let component: DialogPazienteComponent;
  let fixture: ComponentFixture<DialogPazienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPazienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
