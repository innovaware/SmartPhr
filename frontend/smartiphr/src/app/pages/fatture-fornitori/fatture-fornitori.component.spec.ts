import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FattureFornitoriComponent } from './fatture-fornitori.component';

describe('FattureFornitoriComponent', () => {
  let component: FattureFornitoriComponent;
  let fixture: ComponentFixture<FattureFornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FattureFornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FattureFornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
