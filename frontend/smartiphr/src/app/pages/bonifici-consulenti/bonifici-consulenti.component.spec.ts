import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificiConsulentiComponent } from './bonifici-consulenti.component';

describe('BonificiConsulentiComponent', () => {
  let component: BonificiConsulentiComponent;
  let fixture: ComponentFixture<BonificiConsulentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificiConsulentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificiConsulentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
