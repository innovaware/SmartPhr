import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioClinicoComponent } from './diario-clinico.component';

describe('DiarioClinicoComponent', () => {
  let component: DiarioClinicoComponent;
  let fixture: ComponentFixture<DiarioClinicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioClinicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
