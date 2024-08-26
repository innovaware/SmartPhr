import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanificazioneRegistroComponent } from './sanificazione-registro.component';

describe('SanificazioneRegistroComponent', () => {
  let component: SanificazioneRegistroComponent;
  let fixture: ComponentFixture<SanificazioneRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanificazioneRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanificazioneRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
