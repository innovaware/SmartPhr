import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutaPisicoComponent } from './valuta-pisico.component';

describe('ValutaPisicoComponent', () => {
  let component: ValutaPisicoComponent;
  let fixture: ComponentFixture<ValutaPisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValutaPisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutaPisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
