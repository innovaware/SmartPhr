import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAttivitaComponent } from './dialog-attivita.component';

describe('DialogAttivitaComponent', () => {
  let component: DialogAttivitaComponent;
  let fixture: ComponentFixture<DialogAttivitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAttivitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAttivitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
