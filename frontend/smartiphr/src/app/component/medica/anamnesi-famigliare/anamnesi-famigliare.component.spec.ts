import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamnesiFamigliareComponent } from './anamnesi-famigliare.component';

describe('AnamnesiFamigliareComponent', () => {
  let component: AnamnesiFamigliareComponent;
  let fixture: ComponentFixture<AnamnesiFamigliareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamnesiFamigliareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamnesiFamigliareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
