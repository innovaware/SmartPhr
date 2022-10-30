import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMagazzinoComponent } from './dialog-magazzino.component';

describe('DialogMagazzinoComponent', () => {
  let component: DialogMagazzinoComponent;
  let fixture: ComponentFixture<DialogMagazzinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMagazzinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMagazzinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
