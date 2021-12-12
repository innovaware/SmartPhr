import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { schedaAnamnesiFamigliare } from 'src/app/models/schedaAnamnesiFamigliare';

import { AnamnesiFamigliareComponent } from './anamnesi-famigliare.component';

describe('AnamnesiFamigliareComponent', () => {
  let component: AnamnesiFamigliareComponent;
  let fixture: ComponentFixture<AnamnesiFamigliareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AnamnesiFamigliareComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamnesiFamigliareComponent);
    component = fixture.componentInstance;
    component.data = new schedaAnamnesiFamigliare();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
