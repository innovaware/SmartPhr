import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogNewMessageComponent } from './dialog-newMessage.component';


describe('DialogNewMessageComponent', () => {
  let component: DialogNewMessageComponent;
  let fixture: ComponentFixture<DialogNewMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogNewMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
