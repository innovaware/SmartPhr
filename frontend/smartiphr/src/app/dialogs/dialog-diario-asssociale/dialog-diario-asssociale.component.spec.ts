import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiarioAsssocialeComponent } from './dialog-diario-asssociale.component';

describe('DialogDiarioAsssocialeComponent', () => {
  let component: DialogDiarioAsssocialeComponent;
  let fixture: ComponentFixture<DialogDiarioAsssocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDiarioAsssocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDiarioAsssocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
