import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviImpegnativeComponent } from './archivi-impegnative.component';

describe('ArchiviImpegnativeComponent', () => {
  let component: ArchiviImpegnativeComponent;
  let fixture: ComponentFixture<ArchiviImpegnativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviImpegnativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviImpegnativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
