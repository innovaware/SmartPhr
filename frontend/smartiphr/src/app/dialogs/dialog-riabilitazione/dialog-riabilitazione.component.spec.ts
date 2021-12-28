import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRiabilitazioneComponent } from './dialog-riabilitazione.component';

describe('DialogRiabilitazioneComponent', () => {
  let component: DialogRiabilitazioneComponent;
  let fixture: ComponentFixture<DialogRiabilitazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRiabilitazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRiabilitazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
