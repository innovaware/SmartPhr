import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDiarioComponent } from './dialog-diario.component';

describe('DialogDiarioComponent', () => {
  let component: DialogDiarioComponent;
  let fixture: ComponentFixture<DialogDiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
