import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CucinaSanificazioneAmbientiComponent } from './cucina-sanificazione-ambienti.component';

describe('CucinaSanificazioneAmbientiComponent', () => {
  let component: CucinaSanificazioneAmbientiComponent;
  let fixture: ComponentFixture<CucinaSanificazioneAmbientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CucinaSanificazioneAmbientiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CucinaSanificazioneAmbientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
