import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioSocialeComponent } from './diario-sociale.component';

describe('DiarioSocialeComponent', () => {
  let component: DiarioSocialeComponent;
  let fixture: ComponentFixture<DiarioSocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioSocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioSocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
