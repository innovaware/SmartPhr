import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndumentiIngressoComponent } from './indumenti-ingresso.component';

describe('IndumentiIngressoComponent', () => {
  let component: IndumentiIngressoComponent;
  let fixture: ComponentFixture<IndumentiIngressoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndumentiIngressoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndumentiIngressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
