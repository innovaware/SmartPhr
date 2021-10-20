import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FattureSSComponent } from './fatture-ss.component';

describe('FattureSSComponent', () => {
  let component: FattureSSComponent;
  let fixture: ComponentFixture<FattureSSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FattureSSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FattureSSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
