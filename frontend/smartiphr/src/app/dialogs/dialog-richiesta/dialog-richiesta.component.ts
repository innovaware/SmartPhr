import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dipendenti } from '../../models/dipendenti';
import { RichiestePresidiService } from '../../service/richiestePresidi.service';
import { RichiestePresidi } from '../../models/richiestePresidi';
import { MessagesService } from '../../service/messages.service';
import { MaterialiService } from '../../service/materiali.service';
import { Materiali } from '../../models/materiali';

@Component({
  selector: 'app-dialog-richiesta',
  templateUrl: './dialog-richiesta.component.html',
  styleUrls: ['./dialog-richiesta.component.css']
})
export class DialogRichiestaPresidiComponent implements OnInit {
  
  
  quantita: number;
  note: String;
  richiesta: RichiestePresidi;
  materiali: Materiali[];
  constructor(
    private richiestaServ: RichiestePresidiService,
    private messageServ: MessagesService,
    private materialiServ: MaterialiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dipendente: Dipendenti;
      type: String;
    }) {
    this.richiesta = new RichiestePresidi();
    this.materiali = [];
    materialiServ.get().then((res: Materiali[]) => {
      this.materiali = res.filter(x => x.type == data.type);
    });
  }


  ngOnInit(): void {
  }

  salva() {
    if (this.richiesta.quantita.valueOf() <= 0) {
      this.messageServ.showMessageError("Inserire quantità");
      return;
    }
    if (this.richiesta.materiale.valueOf() =="") {
      this.messageServ.showMessageError("Seleziona materiale");
      return;
    }
    this.richiesta.dipendente = this.data.dipendente._id;
    this.richiesta.dipendenteName = this.data.dipendente.cognome + " " + this.data.dipendente.nome;
    this.richiesta.type = this.data.type;
    this.richiestaServ.insert(this.richiesta);
  }


}
