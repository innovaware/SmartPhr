import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFornitoriComponent } from './admin-fornitori.component';

describe('AdminFornitoriComponent', () => {
  let component: AdminFornitoriComponent;
  let fixture: ComponentFixture<AdminFornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
