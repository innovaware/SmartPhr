import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Presidi } from 'src/app/models/presidi';
import { MessagesService } from '../../service/messages.service';

@Component({
  selector: 'app-dialog-presidio',
  templateUrl: './dialog-presidio.component.html',
  styleUrls: ['./dialog-presidio.component.css']
})
export class DialogPresidioComponent implements OnInit {

  @Input() disable: boolean;
  @Input() isNew: boolean;
  constructor(
    public messServ: MessagesService,
    public dialogRef: MatDialogRef<DialogPresidioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: Presidi; title: string; readOnly: Boolean; }) {
    
    console.log("item: ", this.data.row);
    if (data.readOnly) {
      this.disable = true;
    }
    else {
     // this.data.row.scadenza = undefined;
      this.disable = false;
    }
  }


  ngOnInit() {
  }

  save() {
    if (this.data.row.descrizione == "" || this.data.row.descrizione == undefined || this.data.row.descrizione == null) {
      this.messServ.showMessageError("Inserire descrizione");
      return;
    }
    if (this.data.row.nome == "" || this.data.row.nome == undefined || this.data.row.nome == null) {
      this.messServ.showMessageError("Inserire nome");
      return;
    }

    if (this.data.row.taglia == "" || this.data.row.taglia == undefined || this.data.row.taglia == null) {
      this.messServ.showMessageError("Inserire taglia");
      return;
    }

    if (this.data.row.giacenza == 0 || this.data.row.giacenza == undefined || this.data.row.giacenza == null) {
      this.messServ.showMessageError("Inserire giacenza");
      return;
    }

    if (this.data.row.qtyTot == 0 || this.data.row.qtyTot == undefined || this.data.row.qtyTot == null) {
      this.messServ.showMessageError("Inserire quantità");
      return;
    }
    if (this.data.row.qty == 0 || this.data.row.qty == undefined || this.data.row.qty == null) {
      this.messServ.showMessageError("Inserire quantità per confezione");
      return;
    }

    if (this.data.row.quantitaOccupata !== undefined && this.data.row.quantitaOccupata !== null && this.data.row.quantitaOccupata != 0) {
      this.data.row.quantitaDisponibile = (this.data.row.qty * this.data.row.qtyTot) - this.data.row.quantitaOccupata.valueOf();
    }
    else {
      this.data.row.quantitaDisponibile = this.data.row.qty * this.data.row.qtyTot;
    }
    this.dialogRef.close(this.data.row);
  }

}
