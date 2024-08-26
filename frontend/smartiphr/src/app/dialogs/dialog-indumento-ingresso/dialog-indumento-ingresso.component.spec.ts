import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIndumentiIngressoComponent } from './dialog-indumento-ingresso.component';

describe('DialogIndumentiIngressoComponent', () => {
  let component: DialogIndumentiIngressoComponent;
  let fixture: ComponentFixture<DialogIndumentiIngressoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIndumentiIngressoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIndumentiIngressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
