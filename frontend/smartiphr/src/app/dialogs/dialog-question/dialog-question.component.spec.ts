import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material";

import { DialogQuestionComponent } from "./dialog-question.component";

describe("DialogQuestionComponent", () => {
  let component: DialogQuestionComponent;
  let fixture: ComponentFixture<DialogQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogQuestionComponent],
      imports: [MatDialogModule, MatDialog, MatDialogRef],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
     ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
