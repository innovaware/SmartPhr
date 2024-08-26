import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportControlloMensileComponent } from './Report-controllo-mensile.component';


describe('ReportControlloMensileComponent', () => {
  let component: ReportControlloMensileComponent;
  let fixture: ComponentFixture<ReportControlloMensileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportControlloMensileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportControlloMensileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
