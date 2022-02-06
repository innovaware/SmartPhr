import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInformationDipendenteComponent } from './register-information-dipendente.component';

describe('RegisterInformationDipendenteComponent', () => {
  let component: RegisterInformationDipendenteComponent;
  let fixture: ComponentFixture<RegisterInformationDipendenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterInformationDipendenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterInformationDipendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
