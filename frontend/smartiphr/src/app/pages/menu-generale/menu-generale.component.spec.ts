import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGeneraleComponent } from './menu-generale.component';

describe('MenuGeneraleComponent', () => {
  let component: MenuGeneraleComponent;
  let fixture: ComponentFixture<MenuGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuGeneraleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
