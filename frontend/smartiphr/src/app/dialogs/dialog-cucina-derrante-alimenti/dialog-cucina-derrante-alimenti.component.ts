import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CucinaDerrateAlimenti } from 'src/app/models/CucinaDerrateAlimenti';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-cucina-derrante-alimenti',
  templateUrl: './dialog-cucina-derrante-alimenti.component.html',
  styleUrls: ['./dialog-cucina-derrante-alimenti.component.css']
})
export class DialogCucinaDerranteAlimentiComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCucinaDerranteAlimentiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CucinaDerrateAlimenti) {

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
