import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaFisioterapiaComponent } from './area-fisioterapia.component';

describe('AreaFisioterapiaComponent', () => {
  let component: AreaFisioterapiaComponent;
  let fixture: ComponentFixture<AreaFisioterapiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaFisioterapiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaFisioterapiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
