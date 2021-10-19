import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonificiFornitoriComponent } from './bonifici-fornitori.component';

describe('BonificiFornitoriComponent', () => {
  let component: BonificiFornitoriComponent;
  let fixture: ComponentFixture<BonificiFornitoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonificiFornitoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonificiFornitoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
