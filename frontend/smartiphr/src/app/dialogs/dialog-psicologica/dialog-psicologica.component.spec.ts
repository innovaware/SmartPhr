import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPisicologicaComponent } from './dialog-psicologica.component';

describe('DialogPisicologicaComponent', () => {
  let component: DialogPisicologicaComponent;
  let fixture: ComponentFixture<DialogPisicologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPisicologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPisicologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
