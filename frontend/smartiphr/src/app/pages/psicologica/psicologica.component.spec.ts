import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PisicologicaComponent } from './pisicologica.component';

describe('PisicologicaComponent', () => {
  let component: PisicologicaComponent;
  let fixture: ComponentFixture<PisicologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PisicologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PisicologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
