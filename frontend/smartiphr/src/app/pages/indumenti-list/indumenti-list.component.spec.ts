import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndumentiListComponent } from './indumenti-list.component';

describe('IndumentiListComponent', () => {
  let component: IndumentiListComponent;
  let fixture: ComponentFixture<IndumentiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndumentiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndumentiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
