import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CucinaDerrateAlimenti } from 'src/app/models/CucinaDerrateAlimenti';

@Component({
  selector: 'app-dialog-cucina-derrante-alimenti-carico',
  templateUrl: './dialog-cucina-derrante-alimenti-carico.component.html',
  styleUrls: ['./dialog-cucina-derrante-alimenti-carico.component.css']
})
export class DialogCucinaDerranteAlimentiCaricoComponent implements OnInit {

 constructor(
    public dialogRef: MatDialogRef<DialogCucinaDerranteAlimentiCaricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CucinaDerrateAlimenti) {
      data.dateInsert = new Date();
  }

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close(this.data);
  }


  cancel() {
    this.dialogRef.close(undefined);
  }
}
