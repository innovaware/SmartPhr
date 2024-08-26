import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApparecchiatureComponent } from './apparecchiature-impianti.component';



describe('ApparecchiatureComponent', () => {
  let component: ApparecchiatureComponent;
  let fixture: ComponentFixture<ApparecchiatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApparecchiatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparecchiatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
