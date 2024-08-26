import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivioConsulentiComponent } from './archivio-consulenti.component';

describe('archivio-consulenti', () => {
  let component: ArchivioConsulentiComponent;
  let fixture: ComponentFixture<ArchivioConsulentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivioConsulentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivioConsulentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
