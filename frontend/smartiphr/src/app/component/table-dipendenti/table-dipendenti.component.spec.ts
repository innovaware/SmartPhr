import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDipendentiComponent } from './table-dipendenti.component';

describe('TableDipendentiComponent', () => {
  let component: TableDipendentiComponent;
  let fixture: ComponentFixture<TableDipendentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDipendentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDipendentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
