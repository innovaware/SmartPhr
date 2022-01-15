import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneMotoriaComponent } from './valutazione-motoria.component';

describe('ValutazioneMotoriaComponent', () => {
  let component: ValutazioneMotoriaComponent;
  let fixture: ComponentFixture<ValutazioneMotoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValutazioneMotoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutazioneMotoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
