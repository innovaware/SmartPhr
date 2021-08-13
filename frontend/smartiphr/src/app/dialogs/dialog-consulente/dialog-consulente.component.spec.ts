import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConsulenteComponent } from './dialog-consulente.component';

describe('DialogConsulenteComponent', () => {
  let component: DialogConsulenteComponent;
  let fixture: ComponentFixture<DialogConsulenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConsulenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConsulenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
