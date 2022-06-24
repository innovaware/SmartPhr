import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFarmacoPazienteComponent } from './dialog-farmaco-paziente.component';

describe('DialogFarmacoPazienteComponent', () => {
  let component: DialogFarmacoPazienteComponent;
  let fixture: ComponentFixture<DialogFarmacoPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFarmacoPazienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFarmacoPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
