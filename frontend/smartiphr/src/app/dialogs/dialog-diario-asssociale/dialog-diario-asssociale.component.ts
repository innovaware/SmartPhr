import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DiarioClinico } from 'src/app/models/diarioClinico';
import { Paziente } from 'src/app/models/paziente';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-diario-asssociale',
  templateUrl: './dialog-diario-asssociale.component.html',
  styleUrls: ['./dialog-diario-asssociale.component.css']
})
export class DialogDiarioAsssocialeComponent implements OnInit {

  public dataDiario:any;
  public contenuto:any;


  constructor( @Inject(MAT_DIALOG_DATA)
  public data: { paziente: Paziente; readonly: boolean; newItem: boolean },    public ccService: CartellaclinicaService,
  public messageService: MessagesService,private dialogRef: MatDialogRef<DialogDiarioAsssocialeComponent>,) { }


  ngOnInit() {
  }


  async salva() {
    console.log("add diario: " + JSON.stringify(this.data.paziente));
    var diario = new DiarioClinico();
    diario.user = this.data.paziente._id;
    diario.data = this.dataDiario;
    diario.contenuto = this.contenuto;


    this.ccService
          .insertDiario(diario)
          .then((x) => {
            console.log("Save diario: ", x);
            this.dialogRef.close(x);
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Inserimento diario (" + err["status"] + ")"
            );
          });
     
    }
}
