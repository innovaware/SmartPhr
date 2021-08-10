import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteSpecialisticheComponent } from './visite-specialistiche.component';

describe('VisiteSpecialisticheComponent', () => {
  let component: VisiteSpecialisticheComponent;
  let fixture: ComponentFixture<VisiteSpecialisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteSpecialisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteSpecialisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
