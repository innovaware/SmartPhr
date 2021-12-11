import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDocumentsComponent } from './archive-documents.component';

describe('ArchiveDocumentsComponent', () => {
  let component: ArchiveDocumentsComponent;
  let fixture: ComponentFixture<ArchiveDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
