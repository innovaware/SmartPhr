import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaFarmaciComponent } from './attivita-farmaci.component';

describe('AttivitaFarmaciComponent', () => {
  let component: AttivitaFarmaciComponent;
  let fixture: ComponentFixture<AttivitaFarmaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttivitaFarmaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttivitaFarmaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
