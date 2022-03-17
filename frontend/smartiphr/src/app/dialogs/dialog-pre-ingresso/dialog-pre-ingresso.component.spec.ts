import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPreIngressoComponent } from './dialog-pre-ingresso.component';

describe('DialogPreIngressoComponent', () => {
  let component: DialogPreIngressoComponent;
  let fixture: ComponentFixture<DialogPreIngressoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPreIngressoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPreIngressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
