import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogCartellaClinicaAltroComponent } from './dialog-cartella-clinica-altro.component';


describe('DialogCartellaClinicaAltroComponent', () => {
  let component: DialogCartellaClinicaAltroComponent;
  let fixture: ComponentFixture<DialogCartellaClinicaAltroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCartellaClinicaAltroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaClinicaAltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
