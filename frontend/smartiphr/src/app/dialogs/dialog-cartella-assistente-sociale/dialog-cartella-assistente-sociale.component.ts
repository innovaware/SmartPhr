import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Paziente } from "src/app/models/paziente";
import { valutazioneSociale } from "src/app/models/valutazioneSociale";
import { IndiceSocializzazione } from "src/app/models/indiceSocializzazione";


import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { DocumentipazientiService } from "src/app/service/documentipazienti.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { cartellaAssSociale } from "src/app/models/cartellaAssSociale";

@Component({
  selector: 'app-dialog-cartella-assistente-sociale',
  templateUrl: './dialog-cartella-assistente-sociale.component.html',
  styleUrls: ['./dialog-cartella-assistente-sociale.component.css']
})
export class DialogCartellaAssistenteSocialeComponent implements OnInit {

  valutazioneSociale: valutazioneSociale;
  indiceSocializzazione: IndiceSocializzazione;


  paziente: Paziente;

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaAssistenteSocialeComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }
  ) {
    console.log("Dialog Cartella AssistenteSociale");

    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.schedaAssSociale == undefined) {
      this.paziente.schedaAssSociale = new cartellaAssSociale();
    }

    if (this.paziente.schedaAssSociale.valutazioneSociale == undefined) {
      this.paziente.schedaAssSociale.valutazioneSociale = new valutazioneSociale();
    }



    if (this.paziente.schedaAssSociale.indiceSocializzazione == undefined) {
      this.paziente.schedaAssSociale.indiceSocializzazione = new IndiceSocializzazione();
    }
 

    this.valutazioneSociale = this.paziente.schedaAssSociale
      .valutazioneSociale as valutazioneSociale;



    this.indiceSocializzazione = this.paziente.schedaAssSociale
      .indiceSocializzazione as IndiceSocializzazione;
   
  }


  ngOnInit() {
  }



  async salva() {
    this.paziente.schedaAssSociale.indiceSocializzazione.totale = Number(this.paziente.schedaAssSociale.indiceSocializzazione.adattamentoSociale) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.relAmicizia) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.integrazioneGruppo) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.gradoDisp) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.rapportoFamiglia) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.attivitaSociale) + 
                                                                  Number(this.paziente.schedaAssSociale.indiceSocializzazione.attivitaRSA);

    this.paziente.schedaAssSociale.indiceSocializzazione.data = new Date();


    this.pazienteService.save(this.paziente).then((value: Paziente) => {
      console.log(`Patient  saved`, value);
      //this.dialogRef.close(this.paziente);
    });
  }

  
}
