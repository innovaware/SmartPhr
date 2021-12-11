import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviVisiteSpecialisticheComponent } from './archivi-visite-specialistiche.component';

describe('ArchiviVisiteSpecialisticheComponent', () => {
  let component: ArchiviVisiteSpecialisticheComponent;
  let fixture: ComponentFixture<ArchiviVisiteSpecialisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviVisiteSpecialisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviVisiteSpecialisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
