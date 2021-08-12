import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmaciComponent } from './farmaci.component';

describe('FarmaciComponent', () => {
  let component: FarmaciComponent;
  let fixture: ComponentFixture<FarmaciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmaciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
