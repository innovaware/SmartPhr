import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AntincendioComponent } from './antincendio.component';


describe('AntincendioComponent', () => {
  let component: AntincendioComponent;
  let fixture: ComponentFixture<AntincendioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntincendioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntincendioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
