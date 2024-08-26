import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogControlloMensileComponent } from './dialog-controllo-mensile.component';

describe('DialogControlloMensileComponent', () => {
  let component: DialogControlloMensileComponent;
  let fixture: ComponentFixture<DialogControlloMensileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogControlloMensileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogControlloMensileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
