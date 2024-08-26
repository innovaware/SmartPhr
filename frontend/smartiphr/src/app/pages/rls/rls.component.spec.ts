import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RLSComponent } from './rls.component';


describe('RLSComponent', () => {
  let component: RLSComponent;
  let fixture: ComponentFixture<RLSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RLSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RLSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
