import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestFarmacipresidiPazientiComponent } from './gest-farmacipresidi-pazienti.component';

describe('GestFarmacipresidiPazientiComponent', () => {
  let component: GestFarmacipresidiPazientiComponent;
  let fixture: ComponentFixture<GestFarmacipresidiPazientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestFarmacipresidiPazientiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestFarmacipresidiPazientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
