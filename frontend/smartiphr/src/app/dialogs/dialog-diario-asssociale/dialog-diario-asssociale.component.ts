import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DiarioAssSociale } from 'src/app/models/diarioAssSociale';
import { Paziente } from 'src/app/models/paziente';
import { CartellaAssSocialeService } from 'src/app/service/cartella-ass-sociale.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-diario-asssociale',
  templateUrl: './dialog-diario-asssociale.component.html',
  styleUrls: ['./dialog-diario-asssociale.component.css']
})
export class DialogDiarioAsssocialeComponent implements OnInit {

  @Input() disable : boolean;
  @Input() isNew: boolean;

  constructor(public casService: CartellaAssSocialeService,
    public dialogRef: MatDialogRef<DialogDiarioAsssocialeComponent>, public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }, @Inject(MAT_DIALOG_DATA) public item: DiarioAssSociale) {

    }


  ngOnInit() {
  }


  async salva() {
    if(this.item.contenuto == undefined || this.item.contenuto == "")
      this.messageService.showMessageError("Alcuni campi obbligatori sono mancanti!");
    
    else{
      //ADD
      if(this.data.paziente != undefined){

        var diario = new DiarioAssSociale();
        diario.user = this.data.paziente._id;
        diario.data = new Date();
        diario.contenuto = this.item.contenuto;

        console.log("salva diario sociale: " + JSON.stringify(diario));
        this.casService
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


      }else{
        console.log("modifica diario sociale: " + JSON.stringify(this.item));

        this.casService
        .saveDiario(this.item)
        .then((x) => {
          console.log("UPDATE diario: ", this.item);
          this.dialogRef.close(this.item);
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Inserimento diario (" + err["status"] + ")"
          );
        });
      }
    }
  }


}
