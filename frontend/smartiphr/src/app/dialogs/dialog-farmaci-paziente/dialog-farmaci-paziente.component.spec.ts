import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFarmaciPazienteComponent } from './dialog-farmaci-paziente.component';

describe('DialogFarmaciPazienteComponent', () => {
  let component: DialogFarmaciPazienteComponent;
  let fixture: ComponentFixture<DialogFarmaciPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFarmaciPazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFarmaciPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
