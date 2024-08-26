import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavanderiaInternaComponent } from './lavanderia-interna.component';

describe('LavanderiaInternaComponent', () => {
  let component: LavanderiaInternaComponent;
  let fixture: ComponentFixture<LavanderiaInternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LavanderiaInternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
