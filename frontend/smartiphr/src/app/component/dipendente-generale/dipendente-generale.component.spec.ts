import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DipendenteGeneraleComponent } from './dipendente-generale.component';

describe('DipendenteGeneraleComponent', () => {
  let component: DipendenteGeneraleComponent;
  let fixture: ComponentFixture<DipendenteGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DipendenteGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DipendenteGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
