import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RSPPComponent } from './rspp.component';


describe('RSPPComponent', () => {
  let component: RSPPComponent;
  let fixture: ComponentFixture<RSPPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RSPPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RSPPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
