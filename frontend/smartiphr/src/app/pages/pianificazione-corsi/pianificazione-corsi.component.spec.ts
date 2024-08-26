import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PianificazioneCorsiComponent } from './pianificazione-corsi.component';


describe('PianificazioneCorsiComponent', () => {
  let component: PianificazioneCorsiComponent;
  let fixture: ComponentFixture<PianificazioneCorsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianificazioneCorsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianificazioneCorsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
