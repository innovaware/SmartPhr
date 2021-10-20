import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCaricadocumentoComponent } from './dialog-caricadocumento.component';

describe('DialogCaricadocumentoComponent', () => {
  let component: DialogCaricadocumentoComponent;
  let fixture: ComponentFixture<DialogCaricadocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCaricadocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCaricadocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
