import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ICFComponent } from './ICF.component';


describe('ICFComponent', () => {
  let component: ICFComponent;
  let fixture: ComponentFixture<ICFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ICFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ICFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
