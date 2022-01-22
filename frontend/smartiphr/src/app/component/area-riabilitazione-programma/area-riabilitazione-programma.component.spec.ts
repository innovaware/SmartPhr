import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRiabilitazioneProgrammaComponent } from './area-riabilitazione-programma.component';

describe('AreaRiabilitazioneProgrammaComponent', () => {
  let component: AreaRiabilitazioneProgrammaComponent;
  let fixture: ComponentFixture<AreaRiabilitazioneProgrammaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaRiabilitazioneProgrammaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaRiabilitazioneProgrammaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
