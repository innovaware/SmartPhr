import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LavoroPersonaleComponent } from './lavoro-personale.component';

describe('LavoroPersonaleComponent', () => {
  let component: LavoroPersonaleComponent;
  let fixture: ComponentFixture<LavoroPersonaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LavoroPersonaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LavoroPersonaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
