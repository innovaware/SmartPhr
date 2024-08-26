import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stanza } from 'src/app/models/stanza';

@Component({
  selector: 'app-dialog-stanza',
  templateUrl: './dialog-stanza.component.html',
  styleUrls: ['./dialog-stanza.component.css']
})
export class DialogStanzaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogStanzaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stanza) {

      console.log("Stanza: ", data);
    }


  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
