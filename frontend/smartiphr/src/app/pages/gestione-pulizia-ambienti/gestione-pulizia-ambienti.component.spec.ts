import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionePuliziaAmbientiComponent } from './gestione-pulizia-ambienti.component';

describe('GestionePuliziaAmbientiComponent', () => {
  let component: GestionePuliziaAmbientiComponent;
  let fixture: ComponentFixture<GestionePuliziaAmbientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionePuliziaAmbientiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionePuliziaAmbientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
