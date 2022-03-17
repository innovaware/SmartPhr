import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogArmadioComponent } from './dialog-armadio.component';

describe('DialogArmadioComponent', () => {
  let component: DialogArmadioComponent;
  let fixture: ComponentFixture<DialogArmadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogArmadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogArmadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
