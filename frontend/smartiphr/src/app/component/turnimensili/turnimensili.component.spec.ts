import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnimensiliComponent } from './turnimensili.component';

describe('TurnimensiliComponent', () => {
  let component: TurnimensiliComponent;
  let fixture: ComponentFixture<TurnimensiliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnimensiliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnimensiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
