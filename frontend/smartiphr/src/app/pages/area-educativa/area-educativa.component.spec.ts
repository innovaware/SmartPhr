import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEducativaComponent } from './area-educativa.component';

describe('AreaEducativaComponent', () => {
  let component: AreaEducativaComponent;
  let fixture: ComponentFixture<AreaEducativaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaEducativaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
