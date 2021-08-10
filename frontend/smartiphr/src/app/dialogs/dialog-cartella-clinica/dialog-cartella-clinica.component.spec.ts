import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartellaClinicaComponent } from './dialog-cartella-clinica.component';

describe('DialogCartellaClinicaComponent', () => {
  let component: DialogCartellaClinicaComponent;
  let fixture: ComponentFixture<DialogCartellaClinicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCartellaClinicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
