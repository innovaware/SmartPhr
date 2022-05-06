import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiaviOssComponent } from './chiavi-oss.component';

describe('ChiaviOssComponent', () => {
  let component: ChiaviOssComponent;
  let fixture: ComponentFixture<ChiaviOssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiaviOssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiaviOssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
