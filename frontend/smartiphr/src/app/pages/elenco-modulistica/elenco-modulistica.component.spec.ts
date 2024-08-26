import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElencoModulisticaComponent } from './elenco-modulistica.component';


describe('ElencoModulisticaComponent', () => {
  let component: ElencoModulisticaComponent;
  let fixture: ComponentFixture<ElencoModulisticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElencoModulisticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElencoModulisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
