import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CucinaAutoControlloComponent } from './cucina-auto-controllo.component';

describe('CucinaAutoControlloComponent', () => {
  let component: CucinaAutoControlloComponent;
  let fixture: ComponentFixture<CucinaAutoControlloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CucinaAutoControlloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CucinaAutoControlloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
