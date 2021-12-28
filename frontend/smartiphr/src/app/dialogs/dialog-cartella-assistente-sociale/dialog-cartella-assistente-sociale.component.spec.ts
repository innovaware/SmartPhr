import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCartellaAssistenteSocialeComponent } from './dialog-cartella-assistente-sociale.component';

describe('DialogCartellaAssistenteSocialeComponent', () => {
  let component: DialogCartellaAssistenteSocialeComponent;
  let fixture: ComponentFixture<DialogCartellaAssistenteSocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCartellaAssistenteSocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCartellaAssistenteSocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
