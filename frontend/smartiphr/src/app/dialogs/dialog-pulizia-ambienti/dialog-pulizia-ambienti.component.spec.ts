import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPuliziaAmbientiComponent } from './dialog-pulizia-ambienti.component';

describe('DialogPuliziaAmbientiComponent', () => {
  let component: DialogPuliziaAmbientiComponent;
  let fixture: ComponentFixture<DialogPuliziaAmbientiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPuliziaAmbientiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPuliziaAmbientiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
