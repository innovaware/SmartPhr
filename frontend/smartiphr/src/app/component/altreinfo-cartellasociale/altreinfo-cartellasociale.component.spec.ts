import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltreinfoCartellasocialeComponent } from './altreinfo-cartellasociale.component';

describe('AltreinfoCartellasocialeComponent', () => {
  let component: AltreinfoCartellasocialeComponent;
  let fixture: ComponentFixture<AltreinfoCartellasocialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltreinfoCartellasocialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltreinfoCartellasocialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
