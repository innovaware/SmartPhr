import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCucinaDerranteAlimentiComponent } from './dialog-cucina-derrante-alimenti.component';

describe('DialogCucinaDerranteAlimentiComponent', () => {
  let component: DialogCucinaDerranteAlimentiComponent;
  let fixture: ComponentFixture<DialogCucinaDerranteAlimentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCucinaDerranteAlimentiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCucinaDerranteAlimentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
