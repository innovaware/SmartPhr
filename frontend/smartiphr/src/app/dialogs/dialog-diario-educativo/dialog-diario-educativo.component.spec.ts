import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiarioEducativoComponent } from './dialog-diario-educativo.component';

describe('DialogDiarioEducativoComponent', () => {
  let component: DialogDiarioEducativoComponent;
  let fixture: ComponentFixture<DialogDiarioEducativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDiarioEducativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDiarioEducativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
