import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisitespecialisticheComponent } from './dialog-visitespecialistiche.component';

describe('DialogVisitespecialisticheComponent', () => {
  let component: DialogVisitespecialisticheComponent;
  let fixture: ComponentFixture<DialogVisitespecialisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVisitespecialisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVisitespecialisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
