import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FattureConsulentiComponent } from './fatture-consulenti.component';

describe('FattureConsulentiComponent', () => {
  let component: FattureConsulentiComponent;
  let fixture: ComponentFixture<FattureConsulentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FattureConsulentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FattureConsulentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
