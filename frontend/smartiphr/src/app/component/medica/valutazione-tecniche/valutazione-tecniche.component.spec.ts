import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazioneTecnicheComponent } from './valutazione-tecniche.component';

describe('ValutazioneTecnicheComponent', () => {
  let component: ValutazioneTecnicheComponent;
  let fixture: ComponentFixture<ValutazioneTecnicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValutazioneTecnicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValutazioneTecnicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
