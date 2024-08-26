import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaMaterialeComponent } from './richieste-materiale.component';

describe('RichiestaMaterialeComponent', () => {
  let component: RichiestaMaterialeComponent;
  let fixture: ComponentFixture<RichiestaMaterialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RichiestaMaterialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaMaterialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
