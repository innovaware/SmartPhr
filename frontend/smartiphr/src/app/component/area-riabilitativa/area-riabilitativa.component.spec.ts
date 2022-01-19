import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRiabilitativaComponent } from './area-riabilitativa.component';

describe('AreaRiabilitativaComponent', () => {
  let component: AreaRiabilitativaComponent;
  let fixture: ComponentFixture<AreaRiabilitativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaRiabilitativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaRiabilitativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
