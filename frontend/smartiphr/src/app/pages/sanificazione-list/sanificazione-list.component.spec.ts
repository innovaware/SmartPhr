import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanificazioneListComponent } from './sanificazione-list.component';

describe('SanificazioneListComponent', () => {
  let component: SanificazioneListComponent;
  let fixture: ComponentFixture<SanificazioneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanificazioneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanificazioneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
