import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRifacimentoLettiComponent } from './dialog-rifacimento-letti.component';

describe('DialogRifacimentoLettiComponent', () => {
  let component: DialogRifacimentoLettiComponent;
  let fixture: ComponentFixture<DialogRifacimentoLettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogRifacimentoLettiComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRifacimentoLettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
