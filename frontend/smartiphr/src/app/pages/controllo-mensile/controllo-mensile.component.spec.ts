import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlloMensileComponent } from './controllo-mensile.component';


describe('ControlloMensileComponent', () => {
  let component: ControlloMensileComponent;
  let fixture: ComponentFixture<ControlloMensileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlloMensileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlloMensileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
