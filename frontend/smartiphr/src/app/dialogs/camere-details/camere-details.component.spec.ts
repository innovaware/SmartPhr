import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamereDetailsComponent } from './camere-details.component';

describe('CamereDetailsComponent', () => {
  let component: CamereDetailsComponent;
  let fixture: ComponentFixture<CamereDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamereDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamereDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
