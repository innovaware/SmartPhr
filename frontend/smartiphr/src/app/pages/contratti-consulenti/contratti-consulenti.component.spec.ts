import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContrattiConsulentiComponent } from './contratti-consulenti.component';


describe('ContrattiConsulentiComponent', () => {
  let component: ContrattiConsulentiComponent;
  let fixture: ComponentFixture<ContrattiConsulentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContrattiConsulentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContrattiConsulentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
