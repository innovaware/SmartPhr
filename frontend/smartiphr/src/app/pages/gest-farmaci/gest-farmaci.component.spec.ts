import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestFarmaciComponent } from './gest-farmaci.component';

describe('GestFarmaciComponent', () => {
  let component: GestFarmaciComponent;
  let fixture: ComponentFixture<GestFarmaciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestFarmaciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestFarmaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
