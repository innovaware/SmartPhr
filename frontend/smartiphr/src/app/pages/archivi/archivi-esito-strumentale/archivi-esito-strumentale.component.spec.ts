import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiviEsitoStrumentaleComponent } from './archivi-esito-strumentale.component';

describe('ArchiviEsitoStrumentaleComponent', () => {
  let component: ArchiviEsitoStrumentaleComponent;
  let fixture: ComponentFixture<ArchiviEsitoStrumentaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiviEsitoStrumentaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiviEsitoStrumentaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
