import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FerieAltroPersonaleComponent } from './ferie-altro-personale.component';

describe('FerieAltroPersonaleComponent', () => {
  let component: FerieAltroPersonaleComponent;
  let fixture: ComponentFixture<FerieAltroPersonaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FerieAltroPersonaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FerieAltroPersonaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
