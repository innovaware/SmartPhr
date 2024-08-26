import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaRiabilitativa } from 'src/app/models/AreaRiabilitativa';
import { AreaRiabilitativaDiario } from 'src/app/models/AreaRiabilitativaDiario';
import { AreaRiabilitativaProgramma } from 'src/app/models/AreaRiabilitativaProgramma';
import { AreaRiabilitativaTest } from 'src/app/models/AreaRiabilitativaTest';
import { Paziente } from 'src/app/models/paziente';
import { ValutazioneMotoria } from 'src/app/models/ValutazioneMotoria';
import { PazienteService } from 'src/app/service/paziente.service';
import { DocumentoPaziente } from '../../models/documentoPaziente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentipazientiService } from '../../service/documentipazienti.service';
import { MessagesService } from '../../service/messages.service';
import { UploadService } from '../../service/upload.service';

@Component({
  selector: 'app-dialog-riabilitazione',
  templateUrl: './dialog-riabilitazione.component.html',
  styleUrls: ['./dialog-riabilitazione.component.css']
})
export class DialogRiabilitazioneComponent implements OnInit {

  paziente: Paziente;
  valutazioneMotoria: ValutazioneMotoria;
  areaRiabilitativa: AreaRiabilitativa;
  areaRiabilitativaProgramma: AreaRiabilitativaProgramma;
  areaRiabilitativaDiario: AreaRiabilitativaDiario[];
  DisplayedColumns: string[] = ["namefile", "date","note", "action"];

  @ViewChild("paginatorDocsSchedaTinetti", { static: false })
  DocsSchedaTinettiPaginator: MatPaginator;
  public nuovoDocSchedaTinetti: DocumentoPaziente;
  public DocsSchedaTinettiDataSource: MatTableDataSource<DocumentoPaziente>;
  public docsSchedaTinetti: DocumentoPaziente[];
  public uploadingDocSchedaTinetti: boolean;
  public addingDocSchedaTinetti: boolean;

  @ViewChild("paginatorSchedaFIM", { static: false })
  SchedaFIMPaginator: MatPaginator;
  public nuovoSchedaFIM: DocumentoPaziente;
  public SchedaFIMDataSource: MatTableDataSource<DocumentoPaziente>;
  public SchedaFIM: DocumentoPaziente[];
  public uploadingSchedaFIM: boolean;
  public addingSchedaFIM: boolean;


  @ViewChild("paginatorSchedaBARTHEL", { static: false })
  SchedaBARTHELPaginator: MatPaginator;
  public nuovoSchedaBARTHEL: DocumentoPaziente;
  public SchedaBARTHELDataSource: MatTableDataSource<DocumentoPaziente>;
  public SchedaBARTHEL: DocumentoPaziente[];
  public uploadingSchedaBARTHEL: boolean;
  public addingSchedaBARTHEL: boolean;
  constructor(
    public pazienteService: PazienteService,
    public dialogRef: MatDialogRef<DialogRiabilitazioneComponent>,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,

    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }
  ) {
    console.log("Dialog riabilitazione Data: ", data);
    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.valutazioneMotoria == undefined || data.newItem == true) {
      this.paziente.valutazioneMotoria = new ValutazioneMotoria();
    }

    if (this.paziente.areaRiabilitativa == undefined || data.newItem == true) {
      this.paziente.areaRiabilitativa = new AreaRiabilitativa();
    }

    if (this.paziente.areaRiabilitativa.test == undefined) {
      this.paziente.areaRiabilitativa.test = new AreaRiabilitativaTest();
    }

    if (this.paziente.areaRiabilitativaProgramma == undefined) {
      this.paziente.areaRiabilitativaProgramma = new AreaRiabilitativaProgramma();
    }

    if (this.paziente.areaRiabilitativaDiario == undefined) {
      this.paziente.areaRiabilitativaDiario = [];
    }

    this.valutazioneMotoria = this.paziente.valutazioneMotoria as ValutazioneMotoria;
    this.areaRiabilitativa = this.paziente.areaRiabilitativa as AreaRiabilitativa;
    this.areaRiabilitativaProgramma = this.paziente.areaRiabilitativaProgramma as AreaRiabilitativaProgramma;
    this.areaRiabilitativaDiario = this.paziente.areaRiabilitativaDiario as AreaRiabilitativaDiario[];
    this.nuovoDocSchedaTinetti = new DocumentoPaziente();
    this.DocsSchedaTinettiDataSource = new MatTableDataSource<DocumentoPaziente>();
    this.docsSchedaTinetti = [];
    this.getDocsSchedaTinetti();
    this.nuovoSchedaFIM = new DocumentoPaziente();
    this.SchedaFIMDataSource = new MatTableDataSource<DocumentoPaziente>();
    this.SchedaFIM = [];
    this.getSchedaFIM();
    this.nuovoSchedaBARTHEL = new DocumentoPaziente();
    this.SchedaBARTHELDataSource = new MatTableDataSource<DocumentoPaziente>();
    this.SchedaBARTHEL = [];
    this.getSchedaBARTHEL();
  }

  ngOnInit() { }

  save() {
    this.pazienteService.save(this.paziente).then(
      (value: Paziente) => {
        console.log(`Patient  saved`, value);
        this.dialogRef.close(this.paziente);
      }
    )
  }



  async showDocument(doc: DocumentoPaziente) {
    console.log("doc: ", JSON.stringify(doc));
    this.uploadService
      .downloadDocPaziente(doc.filename, doc.type, this.paziente._id)
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


  //SchedaTinetti

  async addDocSchedaTinetti() {
    this.addingDocSchedaTinetti = true;
    this.nuovoDocSchedaTinetti = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "SchedaTinetti",
    };
  }

  async uploadDocSchedaTinetti($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload DocSchedaTinetti: ", $event);
      this.nuovoDocSchedaTinetti.filename = file.name;
      this.nuovoDocSchedaTinetti.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocSchedaTinetti(doc: DocumentoPaziente, i) {

    const index = i;
    console.log("Cancella DocSchedaTinetti index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("DocSchedaTinetti cancellato");
        if (index > -1) {
          this.docsSchedaTinetti.splice(index, 1);
        }

        this.DocsSchedaTinettiDataSource.data = this.docsSchedaTinetti;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc SchedaTinetti"
        );
        console.error(err);
      });
  }

  async saveDocSchedaTinetti(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "SchedaTinetti";
    const path = "SchedaTinetti";
    const file: File = doc.file;
    this.uploadingDocSchedaTinetti = true;

    console.log("Invio DocSchedaTinetti: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert DocSchedaTinetti: ", result);
        this.docsSchedaTinetti.push(result);
        this.DocsSchedaTinettiDataSource.data = this.docsSchedaTinetti;
        this.DocsSchedaTinettiDataSource.paginator = this.DocsSchedaTinettiPaginator;

        this.addingDocSchedaTinetti = false;
        this.uploadingDocSchedaTinetti = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getDocsSchedaTinetti() {
    console.log(`get DocsSchedaTinetti paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "SchedaTinetti")
      .then((f: DocumentoPaziente[]) => {
        this.docsSchedaTinetti = f;

        this.DocsSchedaTinettiDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.docsSchedaTinetti
        );
        this.DocsSchedaTinettiDataSource.paginator = this.DocsSchedaTinettiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsSchedaTinetti"
        );
        console.error(err);
      });
  }



  //Fine:SchedaTinetti


  //SchedaFIM

  async addSchedaFIM() {
    this.addingSchedaFIM = true;
    this.nuovoSchedaFIM = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "SchedaFIM",
    };
  }

  async uploadSchedaFIM($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload SchedaFIM: ", $event);
      this.nuovoSchedaFIM.filename = file.name;
      this.nuovoSchedaFIM.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteSchedaFIM(doc: DocumentoPaziente, i) {

    const index = i;
    console.log("Cancella SchedaFIM index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("SchedaFIM cancellato");
        if (index > -1) {
          this.SchedaFIM.splice(index, 1);
        }

        this.SchedaFIMDataSource.data = this.SchedaFIM;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc SchedaFIM"
        );
        console.error(err);
      });
  }

  async saveSchedaFIM(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "SchedaFIM";
    const path = "SchedaFIM";
    const file: File = doc.file;
    this.uploadingSchedaFIM = true;

    console.log("Invio SchedaFIM: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert SchedaFIM: ", result);
        this.SchedaFIM.push(result);
        this.SchedaFIMDataSource.data = this.SchedaFIM;
        this.SchedaFIMDataSource.paginator = this.SchedaFIMPaginator;

        this.addingSchedaFIM = false;
        this.uploadingSchedaFIM = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getSchedaFIM() {
    console.log(`get DocsSchedaFIM paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "SchedaFIM")
      .then((f: DocumentoPaziente[]) => {
        this.SchedaFIM = f;

        this.SchedaFIMDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.SchedaFIM
        );
        this.SchedaFIMDataSource.paginator = this.SchedaFIMPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsSchedaFIM"
        );
        console.error(err);
      });
  }



  //Fine:SchedaFIM


  //SchedaBARTHEL

  async addSchedaBARTHEL() {
    this.addingSchedaBARTHEL = true;
    this.nuovoSchedaBARTHEL = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "SchedaBARTHEL",
    };
  }

  async uploadSchedaBARTHEL($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload SchedaBARTHEL: ", $event);
      this.nuovoSchedaBARTHEL.filename = file.name;
      this.nuovoSchedaBARTHEL.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteSchedaBARTHEL(doc: DocumentoPaziente, i) {

    const index = i;
    console.log("Cancella SchedaBARTHEL index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("SchedaBARTHEL cancellato");
        if (index > -1) {
          this.SchedaBARTHEL.splice(index, 1);
        }

        this.SchedaBARTHELDataSource.data = this.SchedaBARTHEL;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc SchedaBARTHEL"
        );
        console.error(err);
      });
  }

  async saveSchedaBARTHEL(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "SchedaBARTHEL";
    const path = "SchedaBARTHEL";
    const file: File = doc.file;
    this.uploadingSchedaBARTHEL = true;

    console.log("Invio SchedaBARTHEL: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert SchedaBARTHEL: ", result);
        this.SchedaBARTHEL.push(result);
        this.SchedaBARTHELDataSource.data = this.SchedaBARTHEL;
        this.SchedaBARTHELDataSource.paginator = this.SchedaBARTHELPaginator;

        this.addingSchedaBARTHEL = false;
        this.uploadingSchedaBARTHEL = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getSchedaBARTHEL() {
    console.log(`get DocsSchedaBARTHEL paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "SchedaBARTHEL")
      .then((f: DocumentoPaziente[]) => {
        this.SchedaBARTHEL = f;

        this.SchedaBARTHELDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.SchedaBARTHEL
        );
        this.SchedaBARTHELDataSource.paginator = this.SchedaBARTHELPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsSchedaBARTHEL"
        );
        console.error(err);
      });
  }



  //Fine:SchedaBARTHEL

}
