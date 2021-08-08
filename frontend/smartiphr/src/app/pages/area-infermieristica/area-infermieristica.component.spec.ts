import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaInfermieristicaComponent } from './area-infermieristica.component';

describe('AreaInfermieristicaComponent', () => {
  let component: AreaInfermieristicaComponent;
  let fixture: ComponentFixture<AreaInfermieristicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaInfermieristicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaInfermieristicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
