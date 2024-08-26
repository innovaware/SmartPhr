import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCucinaDerranteAlimentiCaricoComponent } from './dialog-cucina-derrante-alimenti-carico.component';

describe('DialogCucinaDerranteAlimentiCaricoComponent', () => {
  let component: DialogCucinaDerranteAlimentiCaricoComponent;
  let fixture: ComponentFixture<DialogCucinaDerranteAlimentiCaricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCucinaDerranteAlimentiCaricoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCucinaDerranteAlimentiCaricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
