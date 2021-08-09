import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestUtentiComponent } from './gest-utenti.component';

describe('GestUtentiComponent', () => {
  let component: GestUtentiComponent;
  let fixture: ComponentFixture<GestUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
