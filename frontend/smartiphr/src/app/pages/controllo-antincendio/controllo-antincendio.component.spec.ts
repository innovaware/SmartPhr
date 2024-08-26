import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlloAntincendioComponent } from './controllo-antincendio.component';


describe('ControlloAntincendioComponent', () => {
  let component: ControlloAntincendioComponent;
  let fixture: ComponentFixture<ControlloAntincendioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlloAntincendioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlloAntincendioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
