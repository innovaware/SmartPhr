import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRiabilitazioneDiarioComponent } from './area-riabilitazione-diario.component';

describe('AreaRiabilitazioneDiarioComponent', () => {
  let component: AreaRiabilitazioneDiarioComponent;
  let fixture: ComponentFixture<AreaRiabilitazioneDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaRiabilitazioneDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaRiabilitazioneDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
