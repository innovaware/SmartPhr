import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioEducativoComponent } from './diario-educativo.component';

describe('DiarioEducativoComponent', () => {
  let component: DiarioEducativoComponent;
  let fixture: ComponentFixture<DiarioEducativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioEducativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioEducativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
