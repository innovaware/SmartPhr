import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecessoComponent } from './decesso.component';

describe('DecessoComponent', () => {
  let component: DecessoComponent;
  let fixture: ComponentFixture<DecessoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecessoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
