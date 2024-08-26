import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CucinaDerrateAlimentariComponent } from './cucina-derrate-alimentari.component';

describe('CucinaDerrateAlimentariComponent', () => {
  let component: CucinaDerrateAlimentariComponent;
  let fixture: ComponentFixture<CucinaDerrateAlimentariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CucinaDerrateAlimentariComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CucinaDerrateAlimentariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
