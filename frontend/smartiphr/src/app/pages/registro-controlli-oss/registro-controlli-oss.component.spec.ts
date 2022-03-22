import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroControlliOssComponent } from './registro-controlli-oss.component';

describe('RegistroControlliOssComponent', () => {
  let component: RegistroControlliOssComponent;
  let fixture: ComponentFixture<RegistroControlliOssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroControlliOssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroControlliOssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
