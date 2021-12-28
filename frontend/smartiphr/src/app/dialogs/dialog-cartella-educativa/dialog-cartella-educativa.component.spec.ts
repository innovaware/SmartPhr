import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartellaEducativaComponent } from './dialog-cartella-educativa.component';

describe('DialogCartellaEducativaComponent', () => {
  let component: DialogCartellaEducativaComponent;
  let fixture: ComponentFixture<DialogCartellaEducativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCartellaEducativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
