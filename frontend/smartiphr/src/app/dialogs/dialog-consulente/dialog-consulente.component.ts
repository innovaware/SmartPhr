import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Consulenti } from "src/app/models/consulenti";

@Component({
  selector: "app-dialog-consulente",
  templateUrl: "./dialog-consulente.component.html",
  styleUrls: ["./dialog-consulente.component.css"],
})
export class DialogConsulenteComponent implements OnInit {
  disable: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogConsulenteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public item: {
      consulente: Consulenti;
      readonly: boolean;
    }
  ) {
    this.disable = item.readonly;
  }

  ngOnInit() {}

  saveDiario() {
    this.dialogRef.close(this.item);
  }
}
