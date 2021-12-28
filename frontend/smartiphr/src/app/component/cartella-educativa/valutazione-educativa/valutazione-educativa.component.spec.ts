import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneEducativaComponent } from './valutazione-educativa.component';

describe('ValutazioneEducativaComponent', () => {
  let component: ValutazioneEducativaComponent;
  let fixture: ComponentFixture<ValutazioneEducativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValutazioneEducativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutazioneEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
