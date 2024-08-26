import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMenuGeneraleComponent } from './dialog-menu-generale.component';

describe('DialogMenuGeneraleComponent', () => {
  let component: DialogMenuGeneraleComponent;
  let fixture: ComponentFixture<DialogMenuGeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMenuGeneraleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMenuGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
