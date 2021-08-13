import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDipendenteComponent } from './dialog-dipendente.component';

describe('DialogDipendenteComponent', () => {
  let component: DialogDipendenteComponent;
  let fixture: ComponentFixture<DialogDipendenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDipendenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDipendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
