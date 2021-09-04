import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPazientiComponent } from './admin-pazienti.component';

describe('AdminPazientiComponent', () => {
  let component: AdminPazientiComponent;
  let fixture: ComponentFixture<AdminPazientiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPazientiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPazientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
