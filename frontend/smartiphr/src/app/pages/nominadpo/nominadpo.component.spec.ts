import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NominaDPOComponent } from './nominadpo.component';


describe('NominaDPOComponent', () => {
  let component: NominaDPOComponent;
  let fixture: ComponentFixture<NominaDPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NominaDPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NominaDPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
