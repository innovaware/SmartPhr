import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RifacimentoLettiOssComponent } from './rifacimento-letti-oss.component';

describe('RifacimentoLettiOssComponent', () => {
  let component: RifacimentoLettiOssComponent;
  let fixture: ComponentFixture<RifacimentoLettiOssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RifacimentoLettiOssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RifacimentoLettiOssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
