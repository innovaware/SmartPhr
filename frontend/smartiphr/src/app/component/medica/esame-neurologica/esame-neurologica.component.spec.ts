import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsameNeurologicaComponent } from './esame-neurologica.component';

describe('EsameNeurologicaComponent', () => {
  let component: EsameNeurologicaComponent;
  let fixture: ComponentFixture<EsameNeurologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsameNeurologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsameNeurologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
