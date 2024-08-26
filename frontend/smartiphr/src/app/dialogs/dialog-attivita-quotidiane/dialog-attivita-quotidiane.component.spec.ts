import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAttivitaQuotidianeComponent } from './dialog-attivita-quotidiane.component';

describe('DialogAttivitaQuotidianeComponent', () => {
  let component: DialogAttivitaQuotidianeComponent;
  let fixture: ComponentFixture<DialogAttivitaQuotidianeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAttivitaQuotidianeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAttivitaQuotidianeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
