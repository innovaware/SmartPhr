import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssegnazioneLettoComponent } from './assegnazione-letto.component';


describe('AssegnazioneLettoComponent', () => {
  let component: AssegnazioneLettoComponent;
  let fixture: ComponentFixture<AssegnazioneLettoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssegnazioneLettoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssegnazioneLettoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
