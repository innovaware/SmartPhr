import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitePeriodicheComponent } from './visita-periodica.component';


describe('VisitePeriodicheComponent', () => {
  let component: VisitePeriodicheComponent
  let fixture: ComponentFixture<VisitePeriodicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitePeriodicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitePeriodicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
