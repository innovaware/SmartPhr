import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimissioniComponent } from './dimissioni.component';

describe('DimissioniComponent', () => {
  let component: DimissioniComponent;
  let fixture: ComponentFixture<DimissioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimissioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimissioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
