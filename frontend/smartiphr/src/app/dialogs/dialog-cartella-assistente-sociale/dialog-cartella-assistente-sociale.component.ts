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
import { DocumentoPaziente } from "src/app/models/documentoPaziente";
import { Documento } from "src/app/models/documento";
import { AltroCartellaSociale } from "src/app/models/altroCartellaSociale";

@Component({
  selector: 'app-dialog-cartella-assistente-sociale',
  templateUrl: './dialog-cartella-assistente-sociale.component.html',
  styleUrls: ['./dialog-cartella-assistente-sociale.component.css']
})
export class DialogCartellaAssistenteSocialeComponent implements OnInit {
  altroCartellaSociale: AltroCartellaSociale;
  valutazioneSociale: valutazioneSociale;
  indiceSocializzazione: IndiceSocializzazione;
  public document: any[] = [];
  public uploading: boolean;


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

    if (this.paziente.schedaAssSociale.altroCartellaSociale == undefined) {
      this.paziente.schedaAssSociale.altroCartellaSociale = new AltroCartellaSociale();
    }
 

    this.valutazioneSociale = this.paziente.schedaAssSociale
      .valutazioneSociale as valutazioneSociale;



    this.indiceSocializzazione = this.paziente.schedaAssSociale
      .indiceSocializzazione as IndiceSocializzazione;

      this.altroCartellaSociale = this.paziente.schedaAssSociale
      .altroCartellaSociale as AltroCartellaSociale;
   
  }


  ngOnInit() {
    this.getListFile();
  }


  showDocumentGeneric(document: any) {
    console.log("ShowDocument: ", document);
    this.uploadService
      .download(document.name, this.paziente._id, '')
      .then((x) => {
        //console.log("download: ", x);
        x.subscribe((data) => {
           console.log("download: ", data);
           const newBlob = new Blob([data as BlobPart], {
             type: "application/pdf",
           });

           // IE doesn't allow using a blob object directly as link href
           // instead it is necessary to use msSaveOrOpenBlob
           if (window.navigator && window.navigator.msSaveOrOpenBlob) {
             window.navigator.msSaveOrOpenBlob(newBlob);
             return;
           }

           // For other browsers:
           // Create a link pointing to the ObjectURL containing the blob.
           const downloadURL = URL.createObjectURL(newBlob);
           window.open(downloadURL);
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }

  removeDocument(documentRemoving: any) {
    console.log("document to remove: ", documentRemoving);
    this.uploadService.removeFile(documentRemoving.id).subscribe(result=> {
      console.log("document Removed: ", result);
      documentRemoving.status=false;
    });
  }
  
  async upload(typeDocument: string, event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();

      const nameDocument: string = file.name;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}`);
      formData.append("name", nameDocument);

      this.uploading = true;

      if (this.document[typeDocument] == undefined) {
        this.document[typeDocument] = {
          uploading: true,
          error: false
        }
      }

      this.uploadService
        .uploadDocument(formData)
        .then((x: any) => {
          this.uploading = false;

          this.document[typeDocument] = {
            id: x.result.id,
            status: true,
            name: nameDocument,
            uploading: false,
            error: false
          };

        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
          this.document[typeDocument].uploading = false;
          this.document[typeDocument].error = true;
        });
    }
  }

  async showDocument(doc: DocumentoPaziente) {
    console.log("doc: ", JSON.stringify(doc));
    this.uploadService
    .download(doc.filename, doc._id, doc.type)
      .then((x) => {
        console.log("download: ", x);
        x.subscribe((data) => {
          console.log("download: ", data);
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const downloadURL = URL.createObjectURL(newBlob);
          window.open(downloadURL);
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }


  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService
      .getFiles(this.paziente._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          // console.log("document:", doc);
          this.document[doc.typeDocument] = {
            status: true,
            name: doc.name,
            dateupload: doc.dateupload,
          };
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Files");
        console.error(err);
      });
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

    this.paziente.schedaAssSociale.altroCartellaSociale = this.altroCartellaSociale;
    console.log(`Patient  da salvare: `, this.paziente);


    this.pazienteService.save(this.paziente).then((value: Paziente) => {
      console.log(`Patient  saved`, value);
      //this.dialogRef.close(this.paziente);
    });
  }

  
}
