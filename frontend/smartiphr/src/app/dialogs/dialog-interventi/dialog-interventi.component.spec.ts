import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInterventiComponent } from './dialog-interventi.component';

describe('DialogInterventiComponent', () => {
  let component: DialogInterventiComponent;
  let fixture: ComponentFixture<DialogInterventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogInterventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInterventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
