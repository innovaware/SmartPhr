import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CucinaControlloTamponiComponent } from './cucina-controllo-tamponi.component';

describe('CucinaControlloTamponiComponent', () => {
  let component: CucinaControlloTamponiComponent;
  let fixture: ComponentFixture<CucinaControlloTamponiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CucinaControlloTamponiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CucinaControlloTamponiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
