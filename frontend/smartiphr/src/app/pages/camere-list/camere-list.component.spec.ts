import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamereListComponent } from './camere-list.component';

describe('CamereListComponent', () => {
  let component: CamereListComponent;
  let fixture: ComponentFixture<CamereListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamereListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamereListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
