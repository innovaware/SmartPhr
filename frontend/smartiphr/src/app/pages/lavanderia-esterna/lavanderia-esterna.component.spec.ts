import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavanderiaEsternaComponent } from './lavanderia-esterna.component';

describe('LavanderiaEsternaComponent', () => {
  let component: LavanderiaEsternaComponent;
  let fixture: ComponentFixture<LavanderiaEsternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LavanderiaEsternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LavanderiaEsternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
