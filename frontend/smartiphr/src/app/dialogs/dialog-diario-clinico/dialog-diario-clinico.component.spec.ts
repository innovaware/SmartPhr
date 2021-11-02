import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiarioClinicoComponent } from './dialog-diario-clinico.component';

describe('DialogDiarioClinicoComponent', () => {
  let component: DialogDiarioClinicoComponent;
  let fixture: ComponentFixture<DialogDiarioClinicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDiarioClinicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDiarioClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
