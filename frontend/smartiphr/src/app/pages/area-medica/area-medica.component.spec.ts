import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaMedicaComponent } from './area-medica.component';

describe('AreaMedicaComponent', () => {
  let component: AreaMedicaComponent;
  let fixture: ComponentFixture<AreaMedicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaMedicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaMedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
