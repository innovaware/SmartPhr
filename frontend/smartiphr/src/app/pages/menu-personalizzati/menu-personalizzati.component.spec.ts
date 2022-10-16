import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPersonalizzatiComponent } from './menu-personalizzati.component';

describe('MenuPersonalizzatiComponent', () => {
  let component: MenuPersonalizzatiComponent;
  let fixture: ComponentFixture<MenuPersonalizzatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPersonalizzatiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPersonalizzatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
