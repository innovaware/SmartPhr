import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogArchivioMenuPersonalizzatoComponent } from './dialog-archivio-menu-personalizzato.component';

describe('DialogArchivioMenuPersonalizzatoComponent', () => {
  let component: DialogArchivioMenuPersonalizzatoComponent;
  let fixture: ComponentFixture<DialogArchivioMenuPersonalizzatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogArchivioMenuPersonalizzatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogArchivioMenuPersonalizzatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
