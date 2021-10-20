import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FattureSSRComponent } from './fatture-ssr.component';

describe('FattureSSRComponent', () => {
  let component: FattureSSRComponent;
  let fixture: ComponentFixture<FattureSSRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FattureSSRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FattureSSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
