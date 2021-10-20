import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipoFattureASPComponent } from './anticipo-fatture-asp.component';

describe('AnticipoFattureASPComponent', () => {
  let component: AnticipoFattureASPComponent;
  let fixture: ComponentFixture<AnticipoFattureASPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnticipoFattureASPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnticipoFattureASPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
