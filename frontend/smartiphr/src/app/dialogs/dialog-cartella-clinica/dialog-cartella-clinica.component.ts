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
import { Subject } from 'rxjs';
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Documento } from "src/app/models/documento";
import { DocumentoPaziente } from "src/app/models/documentoPaziente";
import { Paziente } from "src/app/models/paziente";
import { schedaAnamnesiFamigliare } from "src/app/models/schedaAnamnesiFamigliare";
import { schedaAnamnesiPatologica } from "src/app/models/schedaAnamnesiPatologica";
import { schedaDecessoOspite } from "src/app/models/schedaDecessoOspite";
import { schedaDimissioneOspite } from "src/app/models/schedaDimissioneOspite";
import { schedaEsameGenerale } from "src/app/models/schedaEsameGenerale";
import { schedaEsameNeurologia } from "src/app/models/schedaEsameNeurologia";
import { schedaMezziContenzione } from "src/app/models/schedaMezziContenzione";
import { schedaValutazioneTecniche } from "src/app/models/schedaValutazioneTecniche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { DocumentipazientiService } from "src/app/service/documentipazienti.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { CartellaEducativa } from "../../models/cartellaEducativa";
import { ValutazioneMotoria } from "../../models/ValutazioneMotoria";

@Component({
  selector: "app-dialog-cartella-clinica",
  templateUrl: "./dialog-cartella-clinica.component.html",
  styleUrls: ["./dialog-cartella-clinica.component.css"],
})
export class DialogCartellaClinicaComponent implements OnInit {
  schedaAnamnesiFamigliare: schedaAnamnesiFamigliare;
  schedaAnamnesiPatologica: schedaAnamnesiPatologica;
  schedaEsameNeurologia: schedaEsameNeurologia;
  schedaEsameGenerale: schedaEsameGenerale;
  schedaMezziContenzione: schedaMezziContenzione;
  schedaValutazioneTecniche: schedaValutazioneTecniche;


  schedaDimissioneOspite: schedaDimissioneOspite;
  schedaDecessoOspite: schedaDecessoOspite;


  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;

  //TODO Da Sistemare questa variabile
  public saveParametriVitali: Subject<string>;
  //public verbaliDataSource: MatTableDataSource<DocumentoPaziente>;


  paziente: Paziente;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  @ViewChild("paginatorPianiTerapeutici",{static: false})
  PianiTerapeuticiPaginator: MatPaginator;
  public nuovoPianoTerapeutico: DocumentoPaziente;
  public pianiTerapeuticiDataSource: MatTableDataSource<DocumentoPaziente>;
  public pianiTerapeutici: DocumentoPaziente[];
  public uploadingPianoTerapeutico: boolean;
  public addingPianoTerapeutico: boolean;

  @ViewChild("paginatorRefertiEsamiStrumentali",{static: false})
  RefertiEsamiStrumentaliPaginator: MatPaginator;
  public nuovoRefertoEsameStrumentale: DocumentoPaziente;
  public refertiEsamiStrumentaliDataSource: MatTableDataSource<DocumentoPaziente>;
  public refertiEsamiStrumentali: DocumentoPaziente[];
  public uploadingRefertoEsameStrumentale: boolean;
  public addingRefertoEsameStrumentale: boolean;

  @ViewChild("paginatorRefertiEsamiEmatochimici",{static: false})
  RefertiEsamiEmatochimiciPaginator: MatPaginator;
  public nuovoRefertoEsameEmatochimico: DocumentoPaziente;
  public refertiEsamiEmatochimiciDataSource: MatTableDataSource<DocumentoPaziente>;
  public refertiEsamiEmatochimici: DocumentoPaziente[];
  public uploadingRefertoEsameEmatochimico: boolean;
  public addingRefertoEsameEmatochimico: boolean;

  @ViewChild("paginatorVerbali",{static: false})
  VerbaliPaginator: MatPaginator;
  public nuovoVerbale: DocumentoPaziente;
  public VerbaliDataSource: MatTableDataSource<DocumentoPaziente>;
  public verbali: DocumentoPaziente[];
  public uploadingVerbale: boolean;
  public addingVerbale: boolean;

  @ViewChild("paginatorRelazioni",{static: false})
  RelazioniPaginator: MatPaginator;
  public nuovoRelazione: DocumentoPaziente;
  public relazioniDataSource: MatTableDataSource<DocumentoPaziente>;
  public relazioni: DocumentoPaziente[];
  public uploadingRelazione: boolean;
  public addingRelazione: boolean;

  @ViewChild("paginatorImpegnative",{static: false})
  ImpegnativePaginator: MatPaginator;
  public nuovoImpegnativa: DocumentoPaziente;
  public impegnativeDataSource: MatTableDataSource<DocumentoPaziente>;
  public impegnative: DocumentoPaziente[];
  public uploadingImpegnativa: boolean;
  public addingImpegnativa: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
      altro: boolean
    }
  ) {
    console.log("Dialog Cartella Clinica");
console.log('altro: ' + this.data.altro);
    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.schedaClinica == undefined) {
      this.paziente.schedaClinica = new CartellaClinica();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiFamigliare == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiFamigliare = new schedaAnamnesiFamigliare();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiPatologica == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiPatologica = new schedaAnamnesiPatologica();
    }

    if (this.paziente.schedaClinica.schedaEsameGenerale == undefined) {
      this.paziente.schedaClinica.schedaEsameGenerale = new schedaEsameGenerale();
    }

    if (this.paziente.schedaClinica.schedaEsameNeurologia == undefined) {
      this.paziente.schedaClinica.schedaEsameNeurologia = new schedaEsameNeurologia();
    }

    if (this.paziente.schedaClinica.schedaMezziContenzione == undefined) {
      this.paziente.schedaClinica.schedaMezziContenzione = new schedaMezziContenzione();
    }

    if (this.paziente.schedaClinica.schedaValutazioneTecniche == undefined) {
      this.paziente.schedaClinica.schedaValutazioneTecniche = new schedaValutazioneTecniche();
    }

    if (this.paziente.schedaEducativa == undefined || this.paziente.schedaEducativa == null) {
      console.log("dentro");
      this.paziente.schedaEducativa = new CartellaEducativa();
    }

    if (this.paziente.valutazioneMotoria == undefined || this.paziente.valutazioneMotoria == null) {
      this.paziente.valutazioneMotoria = new ValutazioneMotoria();
    }
    
    if (this.paziente.schedaClinica.schedaDimissioneOspite == undefined) {
      this.paziente.schedaClinica.schedaDimissioneOspite = new schedaDimissioneOspite();
    }

    if (this.paziente.schedaClinica.schedaDecessoOspite == undefined) {
      this.paziente.schedaClinica.schedaDecessoOspite = new schedaDecessoOspite();
    }

    this.schedaAnamnesiFamigliare = this.paziente.schedaClinica
      .schedaAnamnesiFamigliare as schedaAnamnesiFamigliare;
    this.schedaAnamnesiPatologica = this.paziente.schedaClinica
      .schedaAnamnesiPatologica as schedaAnamnesiPatologica;
    this.schedaEsameGenerale = this.paziente.schedaClinica
      .schedaEsameGenerale as schedaEsameGenerale;
    this.schedaEsameNeurologia = this.paziente.schedaClinica
      .schedaEsameNeurologia as schedaEsameNeurologia;
    this.schedaMezziContenzione = this.paziente.schedaClinica
      .schedaMezziContenzione as schedaMezziContenzione;
    this.schedaValutazioneTecniche = this.paziente.schedaClinica
      .schedaValutazioneTecniche as schedaValutazioneTecniche;
      this.schedaDecessoOspite = this.paziente.schedaClinica
      .schedaDecessoOspite as schedaDecessoOspite;
    this.schedaDimissioneOspite = this.paziente.schedaClinica
      .schedaDimissioneOspite as schedaDimissioneOspite;

  }

  ngOnInit() {
    this.getListFile();
    this.getPianiTerapeutici();
    this.getRefertiEsamiStrumentali();
    this.getRefertiEsameEmatochimico();
    this.getRelazioni();
    this.getVerbali();
    this.getImpegnative();

  }

  showDocumentGeneric(document: any) {
    console.log("ShowDocument: ", document);
    this.uploadService
      .download(document.name, this.paziente._id, '')
      .then((x) => {
        //
        x.subscribe((data) => {
           
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
    .download(doc.filename, doc.paziente, doc.type)
      .then((x) => {
        
        x.subscribe((data) => {
          
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

  async salva() {
    this.pazienteService.save(this.paziente).then((value: Paziente) => {
      console.log(`Patient  saved`, value);
      //this.dialogRef.close(this.paziente);
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

  // PIANI TERAPEUTICI
  async addPianoTerapeutico() {
    this.addingPianoTerapeutico = true;
    this.nuovoPianoTerapeutico = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "PianoTerapeutico",
    };
  }

  async uploadPianoTerapeutico($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload PianoTerapeutico: ", $event);
      this.nuovoPianoTerapeutico.filename = file.name;
      this.nuovoPianoTerapeutico.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletePianoTerapeutico(doc: DocumentoPaziente,i) {

    const index = i;
    console.log("Cancella PianoTerapeutico index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("PianoTerapeutico cancellata");
        if (index > -1) {
          this.pianiTerapeutici.splice(index, 1);
        }

        this.pianiTerapeuticiDataSource.data = this.pianiTerapeutici;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async savePianoTerapeutico(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "PianoTerapeutico";
    const path = "PianoTerapeutico";
    const file: File = doc.file;
    this.uploadingPianoTerapeutico = true;

    console.log("Invio PianoTerapeutico: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert PianoTerapeutico: ", result);
        this.pianiTerapeutici.push(result);
        this.pianiTerapeuticiDataSource.data = this.pianiTerapeutici;
        this.addingPianoTerapeutico = false;
        this.uploadingPianoTerapeutico = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getPianiTerapeutici() {
    console.log(`get PianoTerapeutico paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "PianoTerapeutico")
      .then((f: DocumentoPaziente[]) => {
        this.pianiTerapeutici = f;

        this.pianiTerapeuticiDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.pianiTerapeutici
        );
        this.pianiTerapeuticiDataSource.paginator = this.PianiTerapeuticiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista PianoTerapeutico"
        );
        console.error(err);
      });
  }

  // FINE PIANI TERAPEUTICI

  // REFERTI ESAMI STRUMENTALI
  async addRefertoEsameStrumentale() {
    this.addingRefertoEsameStrumentale = true;
    this.nuovoRefertoEsameStrumentale = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "RefertoEsameStrumentale",
    };
  }

  async uploadRefertoEsameStrumentale($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload RefertoEsameStrumentale: ", $event);
      this.nuovoRefertoEsameStrumentale.filename = file.name;
      this.nuovoRefertoEsameStrumentale.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteRefertoEsameStrumentale(doc: DocumentoPaziente) {
    console.log("Cancella RefertoEsameStrumentale: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("RefertoEsameStrumentale cancellata");
        const index = this.refertiEsamiStrumentali.indexOf(doc);
        console.log("RefertoEsameStrumentale cancellata index: ", index);
        if (index > -1) {
          this.refertiEsamiStrumentali.splice(index, 1);
        }

        console.log(
          "RefertoEsameStrumentale cancellato: ",
          this.refertiEsamiStrumentali
        );
        this.refertiEsamiStrumentaliDataSource.data = this.refertiEsamiStrumentali;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async saveRefertoEsameStrumentale(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "RefertoEsameStrumentale";
    const path = "RefertoEsameStrumentale";
    const file: File = doc.file;
    this.uploadingRefertoEsameStrumentale = true;

    console.log("Invio RefertoEsameStrumentale: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert RefertoEsameStrumentale: ", result);
        this.refertiEsamiStrumentali.push(result);
        this.refertiEsamiStrumentaliDataSource.data = this.refertiEsamiStrumentali;
        this.addingRefertoEsameStrumentale = false;
        this.uploadingRefertoEsameStrumentale = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getRefertiEsamiStrumentali() {
    console.log(`get RefertiEsamiStrumentali paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "RefertoEsameStrumentale")
      .then((f: DocumentoPaziente[]) => {
        this.refertiEsamiStrumentali = f;

        this.refertiEsamiStrumentaliDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.refertiEsamiStrumentali
        );
        this.refertiEsamiStrumentaliDataSource.paginator = this.RefertiEsamiStrumentaliPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista RefertoEsameStrumentale"
        );
        console.error(err);
      });
  }

  // FINE REFERTI ESAMI STRUMENTALI

  // REFERTI ESAMI EMAOCHIMIC
  async addRefertoEsameEmatochimico() {
    this.addingRefertoEsameEmatochimico = true;
    this.nuovoRefertoEsameEmatochimico = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "RefertoEsameEmatochimico",
    };
  }

  async uploadRefertoEsameEmatochimico($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload RefertoEsameEmatochimico: ", $event);
      this.nuovoRefertoEsameEmatochimico.filename = file.name;
      this.nuovoRefertoEsameEmatochimico.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteRefertoEsameEmatochimico(doc: DocumentoPaziente) {
    console.log("Cancella RefertoEsameEmatochimico: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("RefertoEsameEmatochimico cancellata");
        const index = this.refertiEsamiEmatochimici.indexOf(doc);
        console.log("RefertoEsameEmatochimico cancellata index: ", index);
        if (index > -1) {
          this.refertiEsamiEmatochimici.splice(index, 1);
        }

        console.log(
          "RefertoEsameEmatochimico cancellato: ",
          this.refertiEsamiEmatochimici
        );
        this.refertiEsamiEmatochimiciDataSource.data = this.refertiEsamiEmatochimici;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async saveRefertoEsameEmatochimico(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "RefertoEsameEmatochimico";
    const path = "RefertoEsameEmatochimico";
    const file: File = doc.file;
    this.uploadingRefertoEsameEmatochimico = true;

    console.log("Invio RefertoEsameEmatochimico: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert RefertoEsameEmatochimico: ", result);
        this.refertiEsamiEmatochimici.push(result);
        this.refertiEsamiEmatochimiciDataSource.data = this.refertiEsamiEmatochimici;
        this.addingRefertoEsameEmatochimico = false;
        this.uploadingRefertoEsameEmatochimico = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getRefertiEsameEmatochimico() {
    console.log(`get RefertoEsameEmatochimico paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "RefertoEsameEmatochimico")
      .then((f: DocumentoPaziente[]) => {
        this.refertiEsamiEmatochimici = f;

        this.refertiEsamiEmatochimiciDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.refertiEsamiEmatochimici
        );
        this.refertiEsamiEmatochimiciDataSource.paginator = this.RefertiEsamiEmatochimiciPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista RefertoEsameEmatochimico"
        );
        console.error(err);
      });
  }

  // FINE REFERTI ESAMI EMATOCHIMICI

  // RELAZIONI
  async addRelazione() {
    this.addingRelazione = true;
    this.nuovoRelazione = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Relazione",
    };
  }

  async uploadRelazione($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Relazione: ", $event);
      this.nuovoRelazione.filename = file.name;
      this.nuovoRelazione.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteRelazione(doc: DocumentoPaziente) {
    console.log("Cancella Relazione: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Relazione cancellata");
        const index = this.relazioni.indexOf(doc);
        console.log("Relazione cancellata index: ", index);
        if (index > -1) {
          this.relazioni.splice(index, 1);
        }

        console.log("Relazione cancellato: ", this.relazioni);
        this.relazioniDataSource.data = this.relazioni;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async saveRelazione(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Relazione";
    const path = "Relazione";
    const file: File = doc.file;
    this.uploadingRelazione = true;

    console.log("Invio Relazione: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert Relazione: ", result);
        this.relazioni.push(result);
        this.relazioniDataSource.data = this.relazioni;
        this.addingRelazione = false;
        this.uploadingRelazione = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getRelazioni() {
    console.log(`get Relazioni paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "Relazione")
      .then((f: DocumentoPaziente[]) => {
        this.relazioni = f;

        this.relazioniDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.relazioni
        );
        this.relazioniDataSource.paginator = this.RelazioniPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Relazione"
        );
        console.error(err);
      });
  }

  // FINE RELAZIONI

  // VERBALI
  async addVerbale() {
    this.addingVerbale = true;
    this.nuovoVerbale = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Verbale",
    };
  }

  async uploadVerbale($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Verbale: ", $event);
      this.nuovoVerbale.filename = file.name;
      this.nuovoVerbale.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteVerbale(doc: DocumentoPaziente) {
    console.log("Cancella Verbale: ", doc);

    try {
      await this.docService.remove(doc);
      console.log("Verbale cancellata");

      const index = this.verbali.indexOf(doc);
      console.log("Verbale cancellata index: ", index);

      if (index > -1) {
        this.verbali.splice(index, 1);
      }

      // Forza l'aggiornamento della tabella creando una nuova istanza dell'array
      this.VerbaliDataSource.data = [...this.verbali];
      console.log("Verbale cancellato: ", this.VerbaliDataSource.data);

    } catch (err) {
      this.messageService.showMessageError(
        "Errore nella cancellazione del documento di identità"
      );
      console.error(err);
    }
  }


  async saveVerbale(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Verbale";
    const path = "Verbale";
    const file: File = doc.file;
    this.uploadingVerbale = true;

    console.log("Invio Verbale: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert Verbale: ", result);
        this.verbali.push(result);
        this.VerbaliDataSource.data = this.verbali;
        this.addingVerbale = false;
        this.uploadingVerbale = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getVerbali() {
    console.log(`get verbali paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "Verbale")
      .then((f: DocumentoPaziente[]) => {
        this.verbali = f;
console.log('verbali: ' + JSON.stringify(this.verbali));
        this.VerbaliDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.verbali
        );
        this.VerbaliDataSource.paginator = this.VerbaliPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista verbali"
        );
        console.error(err);
      });
  }

  // FINE VERBALI

  // VERBALI
  async addImpegnativa() {
    this.addingImpegnativa = true;
    this.nuovoImpegnativa = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Impegnativa",
    };
  }

  async uploadImpegnativa($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Impegnativa: ", $event);
      this.nuovoImpegnativa.filename = file.name;
      this.nuovoImpegnativa.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteImpegnativa(doc: DocumentoPaziente) {
    console.log("Cancella Impegnativa: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Impegnativa cancellata");
        const index = this.impegnative.indexOf(doc);
        console.log("Impegnativa cancellata index: ", index);
        if (index > -1) {
          this.impegnative.splice(index, 1);
        }

        console.log("Impegnativa cancellato: ", this.impegnative);
        this.impegnativeDataSource.data = this.impegnative;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc impegnativa"
        );
        console.error(err);
      });
  }

  async saveImpegnativa(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Impegnativa";
    const path = "Impegnativa";
    const file: File = doc.file;
    this.uploadingImpegnativa = true;

    console.log("Invio Impegnativa: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert Impegnativa: ", result);
        this.impegnative.push(result);
        this.impegnativeDataSource.data = this.impegnative;
        this.addingImpegnativa = false;
        this.uploadingImpegnativa = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getImpegnative() {
    console.log(`get Impegnative paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "Verbale")
      .then((f: DocumentoPaziente[]) => {
        this.impegnative = f;

        this.impegnativeDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.impegnative
        );
        this.impegnativeDataSource.paginator = this.ImpegnativePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista impegnative"
        );
        console.error(err);
      });
  }

  // FINE IMPEGNATIVE
}
