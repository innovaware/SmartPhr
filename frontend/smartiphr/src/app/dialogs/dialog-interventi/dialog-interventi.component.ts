import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SchedaInterventi } from "src/app/models/SchedaInterventi";

@Component({
  selector: "app-dialog-interventi",
  templateUrl: "./dialog-interventi.component.html",
  styleUrls: ["./dialog-interventi.component.css"],
})
export class DialogInterventiComponent implements OnInit {
  @Input() disable: boolean;
  @Input() isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogInterventiComponent>,
    @Inject(MAT_DIALOG_DATA) public item: SchedaInterventi
  ) {
  }

  ngOnInit() {}

  save() {
    this.dialogRef.close(this.item);
  }

}
