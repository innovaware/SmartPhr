import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QualitaGeneraleComponent } from './areaqualita-generale.component';


describe('QualitaGeneraleComponent', () => {
  let component: QualitaGeneraleComponent;
  let fixture: ComponentFixture<QualitaGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualitaGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualitaGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
