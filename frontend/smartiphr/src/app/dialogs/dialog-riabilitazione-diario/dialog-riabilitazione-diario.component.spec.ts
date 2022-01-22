import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRiabilitazioneDiarioComponent } from './dialog-riabilitazione-diario.component';

describe('DialogRiabilitazioneDiarioComponent', () => {
  let component: DialogRiabilitazioneDiarioComponent;
  let fixture: ComponentFixture<DialogRiabilitazioneDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRiabilitazioneDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRiabilitazioneDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
