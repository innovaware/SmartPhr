import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlloLegionellosiComponent } from './controllo-legionellosi.component';


describe('ControlloLegionellosiComponent', () => {
  let component: ControlloLegionellosiComponent;
  let fixture: ComponentFixture<ControlloLegionellosiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlloLegionellosiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlloLegionellosiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
