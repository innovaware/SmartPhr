import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOspitiComponent } from './table-ospiti.component';

describe('TableOspitiComponent', () => {
  let component: TableOspitiComponent;
  let fixture: ComponentFixture<TableOspitiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableOspitiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOspitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
