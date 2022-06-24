import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestPresidiComponent } from './gest-presidi.component';

describe('GestPresidiComponent', () => {
  let component: GestPresidiComponent;
  let fixture: ComponentFixture<GestPresidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestPresidiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestPresidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
