import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsameGeneraleComponent } from './esame-generale.component';

describe('EsameGeneraleComponent', () => {
  let component: EsameGeneraleComponent;
  let fixture: ComponentFixture<EsameGeneraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsameGeneraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsameGeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
