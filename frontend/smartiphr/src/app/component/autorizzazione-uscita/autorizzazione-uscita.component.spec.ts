import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizzazioneUscitaComponent } from './autorizzazione-uscita.component';

describe('AutorizzazioneUscitaComponent', () => {
  let component: AutorizzazioneUscitaComponent;
  let fixture: ComponentFixture<AutorizzazioneUscitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizzazioneUscitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizzazioneUscitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
