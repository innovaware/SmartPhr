import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsamePisicoComponent } from './esame-pisico.component';

describe('EsamePisicoComponent', () => {
  let component: EsamePisicoComponent;
  let fixture: ComponentFixture<EsamePisicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsamePisicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsamePisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
