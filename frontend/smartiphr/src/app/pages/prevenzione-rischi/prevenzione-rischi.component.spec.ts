import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PrevenzioneRischiComponent } from './prevenzione-rischi.component';


describe('PrevenzioneRischiComponent', () => {
  let component: PrevenzioneRischiComponent;
  let fixture: ComponentFixture<PrevenzioneRischiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevenzioneRischiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevenzioneRischiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
