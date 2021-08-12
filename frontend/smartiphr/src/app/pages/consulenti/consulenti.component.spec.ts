import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsulentiComponent } from './consulenti.component';

describe('ConsulentiComponent', () => {
  let component: ConsulentiComponent;
  let fixture: ComponentFixture<ConsulentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsulentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsulentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
