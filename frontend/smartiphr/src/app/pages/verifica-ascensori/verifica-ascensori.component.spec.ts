import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificaAscensoriComponent } from './verifica-ascensori.component';


describe('VerificaAscensoriComponent', () => {
  let component: VerificaAscensoriComponent;
  let fixture: ComponentFixture<VerificaAscensoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificaAscensoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificaAscensoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
