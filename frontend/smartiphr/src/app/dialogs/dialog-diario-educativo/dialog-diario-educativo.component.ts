import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiarioEducativo } from 'src/app/models/diarioEducativo';
import { Paziente } from 'src/app/models/paziente';
import { CartellaEducativaService } from 'src/app/service/cartella-educativa.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-diario-educativo',
  templateUrl: './dialog-diario-educativo.component.html',
  styleUrls: ['./dialog-diario-educativo.component.css']
})
export class DialogDiarioEducativoComponent implements OnInit {

  public dataDiario:any;
  public contenuto:any;


  constructor( @Inject(MAT_DIALOG_DATA)
  public data: { paziente: Paziente; readonly: boolean; newItem: boolean }, @Inject(MAT_DIALOG_DATA) public item: DiarioEducativo,   public ceService: CartellaEducativaService,
  public messageService: MessagesService,private dialogRef: MatDialogRef<DialogDiarioEducativoComponent>,) { }

  ngOnInit() {
  }


  async salva() {
    if(this.item.contenuto == undefined || this.item.contenuto == "")
      this.messageService.showMessageError("Alcuni campi obbligatori sono mancanti!");
    
    else{
       var usLog= localStorage.getItem("currentUser");
       //alert(JSON.stringify(usLog));
      //ADD
      if(this.data.paziente != undefined){

        var diario = new DiarioEducativo();
        diario.user = this.data.paziente._id;
        diario.data = new Date();
        diario.contenuto = this.item.contenuto;

        console.log("salva diario educativo: " + JSON.stringify(diario));
        this.ceService
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
        console.log("modifica diario educativo: " + JSON.stringify(this.item));

        this.ceService
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
