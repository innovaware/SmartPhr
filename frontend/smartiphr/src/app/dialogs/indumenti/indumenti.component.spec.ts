import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndumentiComponent } from './indumenti.component';

describe('IndumentiComponent', () => {
  let component: IndumentiComponent;
  let fixture: ComponentFixture<IndumentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndumentiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndumentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
