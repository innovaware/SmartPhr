import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermessiComponent } from './permessi.component';

describe('PermessiComponent', () => {
  let component: PermessiComponent;
  let fixture: ComponentFixture<PermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
