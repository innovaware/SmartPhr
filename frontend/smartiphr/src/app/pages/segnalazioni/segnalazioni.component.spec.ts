import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegnalazioneComponent } from './segnalazioni.component';

describe('SegnalazioneComponent', () => {
  let component: SegnalazioneComponent;
  let fixture: ComponentFixture<SegnalazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegnalazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegnalazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
