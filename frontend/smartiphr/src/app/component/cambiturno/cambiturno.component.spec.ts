import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiturnoComponent } from './cambiturno.component';

describe('CambiturnoComponent', () => {
  let component: CambiturnoComponent;
  let fixture: ComponentFixture<CambiturnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiturnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiturnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
