import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviRefertiEmatochimiciComponent } from './archivi-referti-ematochimici.component';

describe('ArchiviRefertiEmatochimiciComponent', () => {
  let component: ArchiviRefertiEmatochimiciComponent;
  let fixture: ComponentFixture<ArchiviRefertiEmatochimiciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviRefertiEmatochimiciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviRefertiEmatochimiciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
