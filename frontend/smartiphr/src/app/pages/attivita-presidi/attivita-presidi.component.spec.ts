import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaPresidiComponent } from './attivita-presidi.component';

describe('AttivitaPresidiComponent', () => {
  let component: AttivitaPresidiComponent;
  let fixture: ComponentFixture<AttivitaPresidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttivitaPresidiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttivitaPresidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
