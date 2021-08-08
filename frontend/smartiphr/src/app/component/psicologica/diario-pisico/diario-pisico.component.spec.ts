import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioPisicoComponent } from './diario-pisico.component';

describe('DiarioPisicoComponent', () => {
  let component: DiarioPisicoComponent;
  let fixture: ComponentFixture<DiarioPisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioPisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioPisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
