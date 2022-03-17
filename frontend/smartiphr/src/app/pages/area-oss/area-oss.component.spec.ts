import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaOssComponent } from './area-oss.component';

describe('AreaOssComponent', () => {
  let component: AreaOssComponent;
  let fixture: ComponentFixture<AreaOssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
