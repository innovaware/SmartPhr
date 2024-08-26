import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSegnalazioneComponent } from './dialog-segnalazione.component';

describe('DialogSegnalazioneComponent', () => {
  let component: DialogSegnalazioneComponent;
  let fixture: ComponentFixture<DialogSegnalazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSegnalazioneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSegnalazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
