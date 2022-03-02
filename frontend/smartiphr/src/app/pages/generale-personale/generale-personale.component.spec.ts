import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralePersonaleComponent } from './generale-personale.component';

describe('GeneralePersonaleComponent', () => {
  let component: GeneralePersonaleComponent;
  let fixture: ComponentFixture<GeneralePersonaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralePersonaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralePersonaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
