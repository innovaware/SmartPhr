import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornitoriComponent } from './fornitori.component';

describe('FornitoriComponent', () => {
  let component: FornitoriComponent;
  let fixture: ComponentFixture<FornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
