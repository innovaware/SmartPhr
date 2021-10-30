import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Diario } from 'src/app/models/diario';

@Component({
  selector: 'app-dialog-diario',
  templateUrl: './dialog-diario.component.html',
  styleUrls: ['./dialog-diario.component.css'],
})
export class DialogDiarioComponent implements OnInit {
  @Input() disable : boolean;
  @Input() isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Diario) {

      console.log("Diario: ", item);
    }


  ngOnInit() {
  }

  saveDiario() {
    this.dialogRef.close(this.item);
  }

}
