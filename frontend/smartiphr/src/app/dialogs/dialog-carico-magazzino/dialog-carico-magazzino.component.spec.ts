import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCaricoMagazzinoComponent } from './dialog-carico-magazzino.component';

describe('DialogCaricoMagazzinoComponent', () => {
  let component: DialogCaricoMagazzinoComponent;
  let fixture: ComponentFixture<DialogCaricoMagazzinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCaricoMagazzinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCaricoMagazzinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
