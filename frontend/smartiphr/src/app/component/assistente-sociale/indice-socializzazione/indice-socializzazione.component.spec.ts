import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceSocializzazioneComponent } from './indice-socializzazione.component';

describe('IndiceSocializzazioneComponent', () => {
  let component: IndiceSocializzazioneComponent;
  let fixture: ComponentFixture<IndiceSocializzazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiceSocializzazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiceSocializzazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
