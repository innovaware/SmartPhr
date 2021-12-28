import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocializzazioneEducativaComponent } from './socializzazione-educativa.component';

describe('SocializzazioneEducativaComponent', () => {
  let component: SocializzazioneEducativaComponent;
  let fixture: ComponentFixture<SocializzazioneEducativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocializzazioneEducativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocializzazioneEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
