import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSocialeComponent } from './area-sociale.component';

describe('AreaSocialeComponent', () => {
  let component: AreaSocialeComponent;
  let fixture: ComponentFixture<AreaSocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
