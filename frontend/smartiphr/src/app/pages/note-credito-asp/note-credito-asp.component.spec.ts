import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCreditoASPComponent } from './note-credito-asp.component';

describe('NoteCreditoASPComponent', () => {
  let component: NoteCreditoASPComponent;
  let fixture: ComponentFixture<NoteCreditoASPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteCreditoASPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCreditoASPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
