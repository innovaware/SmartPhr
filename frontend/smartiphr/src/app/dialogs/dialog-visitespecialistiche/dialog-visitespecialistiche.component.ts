import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DiarioClinico } from 'src/app/models/diarioClinico';
import { Paziente } from 'src/app/models/paziente';
import { VisiteSpecialistiche } from 'src/app/models/visiteSpecialistiche';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-visitespecialistiche',
  templateUrl: './dialog-visitespecialistiche.component.html',
  styleUrls: ['./dialog-visitespecialistiche.component.css']
})
export class DialogVisitespecialisticheComponent implements OnInit {


  public dataReq:any;
  public contenuto:any;
  public dataEsec:any;


  constructor( @Inject(MAT_DIALOG_DATA)
  public data: { paziente: Paziente; readonly: boolean; newItem: boolean },    public ccService: CartellaclinicaService,
  public messageService: MessagesService,private dialogRef: MatDialogRef<DialogVisitespecialisticheComponent>,) { }

  ngOnInit() {
  }

  async salva() {
    console.log("add diario: " + JSON.stringify(this.data.paziente));
    var v = new VisiteSpecialistiche();
    v.user = this.data.paziente._id;
    v.dataReq = this.dataReq;
    v.contenuto = this.contenuto;
    v.dataEsec = this.dataEsec;

    this.ccService
          .insertVisita(v)
          .then((x) => {
            console.log("Save visita: ", x);

            this.dialogRef.close();

          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Inserimento visita (" + err["status"] + ")"
            );
          });
     
    }



}
