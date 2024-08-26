import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaFormazioneComponent } from './area-formazione-sicurezza.component';


describe('AreaFormazioneComponent', () => {
  let component: AreaFormazioneComponent;
  let fixture: ComponentFixture<AreaFormazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaFormazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaFormazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
