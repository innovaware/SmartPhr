import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UtenzaComponent } from './utenza.component';


describe('UtenzaComponent', () => {
  let component: UtenzaComponent;
  let fixture: ComponentFixture<UtenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
