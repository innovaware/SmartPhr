import {
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Paziente } from "src/app/models/paziente";


import { DocumentipazientiService } from "src/app/service/documentipazienti.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { CartellaEducativa } from "src/app/models/cartellaEducativa";
import { valutazioneEducativa } from "src/app/models/valutazioneEducativa";
import { ADL } from "src/app/models/ADL";
import { IADL } from "src/app/models/IADL";
import { DiarioEducativo } from "src/app/models/diarioEducativo";
import { SchedaSocializzazione } from 'src/app/models/schedaSocializzazione';

@Component({
  selector: 'app-dialog-cartella-educativa',
  templateUrl: './dialog-cartella-educativa.component.html',
  styleUrls: ['./dialog-cartella-educativa.component.css']
})
export class DialogCartellaEducativaComponent implements OnInit {


  socializzazione: SchedaSocializzazione;
  valutazioneEducativa: valutazioneEducativa;
  ADL : ADL;
  IADL : IADL;
  diarioEducativo : DiarioEducativo[];



  paziente: Paziente;

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaEducativaComponent>,
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

    if (this.paziente.schedaEducativa == undefined) {
      this.paziente.schedaEducativa = new CartellaEducativa();
    }

    if (this.paziente.schedaEducativa.schedaSocializzazione == undefined) {
      this.paziente.schedaEducativa.schedaSocializzazione = new SchedaSocializzazione();
    }

    if (this.paziente.schedaEducativa.valutazioneEducativa == undefined) {
      this.paziente.schedaEducativa.valutazioneEducativa = new valutazioneEducativa();
    }

    if (this.paziente.schedaEducativa.ADL == undefined) {
      this.paziente.schedaEducativa.ADL = new ADL();
    }

    if (this.paziente.schedaEducativa.IADL == undefined) {
      this.paziente.schedaEducativa.IADL = new IADL();
    }



    this.valutazioneEducativa = this.paziente.schedaEducativa
      .valutazioneEducativa as valutazioneEducativa;


    this.socializzazione = this.paziente.schedaEducativa
      .schedaSocializzazione as SchedaSocializzazione;


    this.ADL = this.paziente.schedaEducativa.ADL as ADL;

    this.IADL = this.paziente.schedaEducativa.IADL as IADL;

 

  }


  ngOnInit() {
  }



  async salva() {
    this.paziente.schedaEducativa.ADL.totale =  Number(this.paziente.schedaEducativa.ADL.A.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.ADL.B.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.ADL.C.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.ADL.D.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.ADL.E.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.ADL.F.split("-") [1]);

    this.paziente.schedaEducativa.IADL.totale =  Number(this.paziente.schedaEducativa.IADL.A.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.B.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.C.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.D.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.E.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.F.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.G.split("-") [1]) +
                                                Number(this.paziente.schedaEducativa.IADL.H.split("-") [1]);


    this.pazienteService.save(this.paziente).then((value: Paziente) => {
      console.log(`Patient  saved`, value);
      this.dialogRef.close(this.paziente);
    });
  }



}
