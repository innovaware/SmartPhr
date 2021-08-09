import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStanzaComponent } from './dialog-stanza.component';

describe('DialogStanzaComponent', () => {
  let component: DialogStanzaComponent;
  let fixture: ComponentFixture<DialogStanzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStanzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
