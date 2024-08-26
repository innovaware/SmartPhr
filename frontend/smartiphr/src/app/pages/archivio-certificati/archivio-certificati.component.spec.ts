import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivioCertificatiComponent } from './archivio-certificati.component';


describe('ArchivioCertificatiComponent', () => {
  let component: ArchivioCertificatiComponent;
  let fixture: ComponentFixture<ArchivioCertificatiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivioCertificatiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivioCertificatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
