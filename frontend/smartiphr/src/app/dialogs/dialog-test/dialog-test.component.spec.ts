import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTestRiabilitativoComponent } from './dialog-test.component';

describe('DialogTestRiabilitativoComponent', () => {
  let component: DialogTestRiabilitativoComponent;
  let fixture: ComponentFixture<DialogTestRiabilitativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogTestRiabilitativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTestRiabilitativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
