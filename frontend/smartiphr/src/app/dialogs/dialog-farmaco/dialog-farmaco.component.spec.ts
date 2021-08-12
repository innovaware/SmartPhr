import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFarmacoComponent } from './dialog-farmaco.component';

describe('DialogFarmacoComponent', () => {
  let component: DialogFarmacoComponent;
  let fixture: ComponentFixture<DialogFarmacoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFarmacoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFarmacoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
