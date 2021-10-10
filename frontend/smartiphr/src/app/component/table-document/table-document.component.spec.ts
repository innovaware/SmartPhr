import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDocumentComponent } from './table-document.component';

describe('TableDocumentComponent', () => {
  let component: TableDocumentComponent;
  let fixture: ComponentFixture<TableDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
