import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaOssComponent } from './attivita-oss.component';

describe('AttivitaOssComponent', () => {
  let component: AttivitaOssComponent;
  let fixture: ComponentFixture<AttivitaOssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttivitaOssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttivitaOssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
