import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitePreAssunzioniComponent } from './visita-pre-assunzioni.component';


describe('VisitePreAssunzioniComponent', () => {
  let component: VisitePreAssunzioniComponent;
  let fixture: ComponentFixture<VisitePreAssunzioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitePreAssunzioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitePreAssunzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
