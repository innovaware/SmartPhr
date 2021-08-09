import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestStanzeComponent } from './gest-stanze.component';

describe('GestStanzeComponent', () => {
  let component: GestStanzeComponent;
  let fixture: ComponentFixture<GestStanzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestStanzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestStanzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
