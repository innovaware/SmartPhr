import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicoLavoroComponent } from './medico-lavoro.component';


describe('MedicoLavoroComponent', () => {
  let component: MedicoLavoroComponent;
  let fixture: ComponentFixture<MedicoLavoroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoLavoroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoLavoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
