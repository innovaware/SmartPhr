import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspettoCMASPComponent } from './prospetto-cm-asp.component';

describe('ProspettoCMASPComponent', () => {
  let component: ProspettoCMASPComponent;
  let fixture: ComponentFixture<ProspettoCMASPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspettoCMASPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspettoCMASPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
