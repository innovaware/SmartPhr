import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviPAIComponent } from './archivi-pai.component';

describe('ArchiviPAIComponent', () => {
  let component: ArchiviPAIComponent;
  let fixture: ComponentFixture<ArchiviPAIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviPAIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviPAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
