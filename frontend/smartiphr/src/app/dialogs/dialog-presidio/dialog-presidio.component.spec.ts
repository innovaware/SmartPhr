import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPresidioComponent } from './dialog-presidio.component';

describe('DialogPresidioComponent', () => {
  let component: DialogPresidioComponent;
  let fixture: ComponentFixture<DialogPresidioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPresidioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPresidioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
