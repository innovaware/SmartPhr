import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerificaArmadioComponent } from './dialog-verifica-armadio.component';

describe('DialogVerificaArmadioComponent', () => {
  let component: DialogVerificaArmadioComponent;
  let fixture: ComponentFixture<DialogVerificaArmadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogVerificaArmadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerificaArmadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
