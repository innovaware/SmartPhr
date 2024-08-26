import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RichiestaPresidiComponent } from './richiestePresidi.component';


describe('RichiestaPresidiComponent', () => {
  let component: RichiestaPresidiComponent;
  let fixture: ComponentFixture<RichiestaPresidiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaPresidiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaPresidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
