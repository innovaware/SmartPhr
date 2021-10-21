import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoFattureASPComponent } from './punto-fatture-asp.component';

describe('PuntoFattureASPComponent', () => {
  let component: PuntoFattureASPComponent;
  let fixture: ComponentFixture<PuntoFattureASPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuntoFattureASPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoFattureASPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
