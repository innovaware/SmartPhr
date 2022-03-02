import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsamiPrivacyPersonaleComponent } from './esami-privacy-personale.component';

describe('EsamiPrivacyPersonaleComponent', () => {
  let component: EsamiPrivacyPersonaleComponent;
  let fixture: ComponentFixture<EsamiPrivacyPersonaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsamiPrivacyPersonaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsamiPrivacyPersonaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
