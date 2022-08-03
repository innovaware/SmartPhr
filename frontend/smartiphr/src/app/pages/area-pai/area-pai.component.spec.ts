import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaPaiComponent } from './area-pai.component';

describe('AreaPaiComponent', () => {
  let component: AreaPaiComponent;
  let fixture: ComponentFixture<AreaPaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaPaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaPaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
