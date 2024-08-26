import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PianoScadenzeComponent } from './piano-scadenze.component';



describe('PianoScadenzeComponent', () => {
  let component: PianoScadenzeComponent;
  let fixture: ComponentFixture<PianoScadenzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoScadenzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoScadenzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
