import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PazienteGeneraleComponent } from './paziente-generale.component';

describe('PazienteGeneraleComponent', () => {
  let component: PazienteGeneraleComponent;
  let fixture: ComponentFixture<PazienteGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PazienteGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PazienteGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
