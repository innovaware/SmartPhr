import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFornitoreComponent } from './dialog-fornitore.component';

describe('DialogFornitoreComponent', () => {
  let component: DialogFornitoreComponent;
  let fixture: ComponentFixture<DialogFornitoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFornitoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFornitoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
