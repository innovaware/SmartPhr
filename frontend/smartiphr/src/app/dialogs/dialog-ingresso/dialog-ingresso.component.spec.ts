import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIngressoComponent } from './dialog-ingresso.component';

describe('DialogIngressoComponent', () => {
  let component: DialogIngressoComponent;
  let fixture: ComponentFixture<DialogIngressoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIngressoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIngressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
