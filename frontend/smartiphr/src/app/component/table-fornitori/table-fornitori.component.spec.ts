import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFornitoriComponent } from './table-fornitori.component';

describe('TableFornitoriComponent', () => {
  let component: TableFornitoriComponent;
  let fixture: ComponentFixture<TableFornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
