import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRichiestaPresidiComponent } from './dialog-richiesta.component';


describe('DialogRichiestaPresidiComponent', () => {
  let component: DialogRichiestaPresidiComponent;
  let fixture: ComponentFixture<DialogRichiestaPresidiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogRichiestaPresidiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRichiestaPresidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
