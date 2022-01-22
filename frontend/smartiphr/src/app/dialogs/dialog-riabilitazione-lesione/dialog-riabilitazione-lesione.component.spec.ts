import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRiabilitazioneLesioneComponent } from './dialog-riabilitazione-lesione.component';

describe('DialogRiabilitazioneLesioneComponent', () => {
  let component: DialogRiabilitazioneLesioneComponent;
  let fixture: ComponentFixture<DialogRiabilitazioneLesioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRiabilitazioneLesioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRiabilitazioneLesioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
