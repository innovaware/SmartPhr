import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: "app-dialog-message-error",
  templateUrl: "./dialog-message-error.component.html",
  styleUrls: ["./dialog-message-error.component.css"],
})
export class DialogMessageErrorComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogMessageErrorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public message: any
  ) {
  }

  ngOnInit() {}
}
