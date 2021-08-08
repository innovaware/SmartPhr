import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OspitiComponent } from './ospiti.component';

describe('OspitiComponent', () => {
  let component: OspitiComponent;
  let fixture: ComponentFixture<OspitiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OspitiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OspitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
