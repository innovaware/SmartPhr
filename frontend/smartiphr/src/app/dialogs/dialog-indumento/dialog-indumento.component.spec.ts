import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIndumentoComponent } from './dialog-indumento.component';

describe('DialogIndumentoComponent', () => {
  let component: DialogIndumentoComponent;
  let fixture: ComponentFixture<DialogIndumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogIndumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIndumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
