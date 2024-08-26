import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadiListComponent } from './armadi-list.component';

describe('ArmadiListComponent', () => {
  let component: ArmadiListComponent;
  let fixture: ComponentFixture<ArmadiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmadiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmadiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
