import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamereMapComponent } from './camere-map.component';

describe('CamereMapComponent', () => {
  let component: CamereMapComponent;
  let fixture: ComponentFixture<CamereMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamereMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamereMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
