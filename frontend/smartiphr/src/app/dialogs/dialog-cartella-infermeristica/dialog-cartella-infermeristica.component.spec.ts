import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartellaInfermeristicaComponent } from './dialog-cartella-infermeristica.component';

describe('DialogCartellaInfermeristicaComponent', () => {
  let component: DialogCartellaInfermeristicaComponent;
  let fixture: ComponentFixture<DialogCartellaInfermeristicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCartellaInfermeristicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaInfermeristicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
