import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MezziContenzioneComponent } from './mezzi-contenzione.component';

describe('MezziContenzioneComponent', () => {
  let component: MezziContenzioneComponent;
  let fixture: ComponentFixture<MezziContenzioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MezziContenzioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MezziContenzioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
