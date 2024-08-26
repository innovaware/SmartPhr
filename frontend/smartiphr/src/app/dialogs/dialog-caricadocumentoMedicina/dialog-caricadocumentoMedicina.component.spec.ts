import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogCaricadocumentoMedicinaComponent } from './dialog-caricadocumentoMedicina.component';


describe('DialogCaricadocumentoMedicinaComponent', () => {
  let component: DialogCaricadocumentoMedicinaComponent;
  let fixture: ComponentFixture<DialogCaricadocumentoMedicinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCaricadocumentoMedicinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCaricadocumentoMedicinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
