import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaTerapeuticaComponent } from './scheda-terapeutica.component';

describe('SchedaTerapeuticaComponent', () => {
  let component: SchedaTerapeuticaComponent;
  let fixture: ComponentFixture<SchedaTerapeuticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedaTerapeuticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedaTerapeuticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
