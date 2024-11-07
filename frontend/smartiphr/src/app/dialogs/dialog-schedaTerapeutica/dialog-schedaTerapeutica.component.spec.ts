import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSchedaTerapeuticaComponent } from './dialog-schedaTerapeutica.component';

describe('DialogSchedaTerapeuticaComponent', () => {
  let component: DialogSchedaTerapeuticaComponent;
  let fixture: ComponentFixture<DialogSchedaTerapeuticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSchedaTerapeuticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSchedaTerapeuticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
