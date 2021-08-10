import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamnesiPatologicaComponent } from './anamnesi-patologica.component';

describe('AnamnesiPatologicaComponent', () => {
  let component: AnamnesiPatologicaComponent;
  let fixture: ComponentFixture<AnamnesiPatologicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamnesiPatologicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamnesiPatologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
