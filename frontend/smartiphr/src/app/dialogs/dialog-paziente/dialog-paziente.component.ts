import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PazienteGeneraleComponent } from "src/app/component/paziente-generale/paziente-generale.component";
import { Bonifico } from 'src/app/models/bonifico';
import { Documento } from "src/app/models/documento";
import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Paziente } from "src/app/models/paziente";
import { BonificoService } from 'src/app/service/bonifico.service';
import { FattureService } from "src/app/service/fatture.service";
import { MessagesService } from 'src/app/service/messages.service';
import { NotaCreditoService } from "src/app/service/notacredito.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import CodiceFiscale from "codice-fiscale-js";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { SchedaTerapeutica } from "../../models/schedaTerapeutica";
import { SchedaTerapeuticaService } from "../../service/schedaTerapeutica.service";

@Component({
  selector: "app-dialog-paziente",
  templateUrl: "./dialog-paziente.component.html",
  styleUrls: ["./dialog-paziente.component.css"],
})
export class DialogPazienteComponent implements OnInit {
  public paziente: Paziente;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;
  public uploadingNotaCredito: boolean;
  public uploadingBonifici: boolean;
  public addingFattura: boolean;
  public addingNotaCredito: boolean;
  public addingBonifici: boolean;

  public nuovaFattura: Fatture;
  public nuovaNotacredito: NotaCredito;
  public nuovaBonifico: Bonifico;

  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public fattureDataSource: MatTableDataSource<Fatture>;
  public noteCreditoDataSource: MatTableDataSource<NotaCredito>;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  @ViewChild("paginatorFatture", {static: false})
  fatturePaginator: MatPaginator;
  @ViewChild("paginatorNoteCredito", {static: false})
  notacreditoPaginator: MatPaginator;
  @ViewChild("paginatorBonifici", {static: false})
  bonificiPaginator: MatPaginator;

  public fatture: Fatture[];
  public noteCredito: NotaCredito[];
  public bonifici: Bonifico[];

  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<PazienteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public notacreditoService: NotaCreditoService,
    public bonficoService: BonificoService,
    public pazienteService: PazienteService,
    public messageService: MessagesService,
    public schedaServ: SchedaTerapeuticaService,
    public dialog: MatDialog
  ) {
    this.dialogRef.addPanelClass('fornitore-dialog-container');
    this.dialogRef.updateSize('90%', '90%');
    this.dialogRef.updatePosition({ top: '24px' });
    this.uploading = false;
    this.paziente = this.data.paziente;
    this.newItem = this.data.newItem || false;
    this.uploadingFattura = false;
    this.addingFattura = false;
    this.addingNotaCredito = false;
    this.uploadingNotaCredito = false;
    this.uploadingBonifici = false;
    dialogRef.disableClose = true;

    //this.paziente = JSON.parse(JSON.stringify(this.data.paziente));
    console.log("Dialog paziente generale", this.data);
  }


  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24 * 365;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  async save(saveAndClose: boolean) {
    console.log("this.newItem: " + this.newItem);
    this.data.paziente = this.paziente;

    // Helper per controllare campi vuoti o nulli
    const isEmpty = (value: any) => value == null || value === "";

    // Controllo campi obbligatori
    const missingFields: string[] = [];
    if (isEmpty(this.data.paziente.cognome)) missingFields.push("Cognome");
    if (isEmpty(this.data.paziente.nome)) missingFields.push("Nome");
    if (isEmpty(this.data.paziente.codiceFiscale)) missingFields.push("Codice Fiscale");
    if (isEmpty(this.data.paziente.sesso)) missingFields.push("Sesso");

    if (missingFields.length > 0) {
      this.messageService.showMessageError(`I campi ${missingFields.join(", ")} sono obbligatori!!`);
      return;
    }

    // Controllo sulla data di nascita
    if (this.dateDiffInDays(new Date(this.data.paziente.dataNascita), new Date()) < 10) {
      this.messageService.showMessageError("Data di nascita Errata!!!");
      return;
    }

    try {
      this.uploading = true;

      if (this.newItem) {
        // Inserimento nuovo paziente
        this.data.paziente = await this.pazienteService.insert(this.data.paziente);
        this.paziente = this.data.paziente;

        // Creazione scheda terapeutica associata
        const scheda: SchedaTerapeutica = {
            firme: [],
            Orale: [],
            IMEVSC: [],
            Estemporanea: [],
            alvo: [],
            idPaziente: this.paziente._id,
            allergie: ""
        };
        await this.schedaServ.add(scheda);
      } else {
        // Salvataggio paziente esistente
        this.data.paziente = await this.pazienteService.save(this.data.paziente);
      }

      console.log("Save paziente: ", this.data.paziente);
      this.newItem = false;

      if (saveAndClose) {
        this.dialogRef.close(this.data.paziente);
      }
    } catch (err) {
      const errorMessage = this.newItem
        ? "Errore Inserimento Paziente"
        : "Errore Salvataggio Paziente";
      this.messageService.showMessageError(`${errorMessage} (${err["status"]})`);
    } finally {
      this.uploading = false;
    }
  }

  //async save(saveAndClose: boolean) {
  //  console.log("this.newItem: " + this.newItem);
  //  this.data.paziente = this.paziente;


  //  if (
  //    this.data.paziente.cognome == "" || this.data.paziente.cognome == null || this.data.paziente.cognome === undefined ||
  //    this.data.paziente.nome == "" || this.data.paziente.nome == null || this.data.paziente.nome === undefined ||
  //    this.data.paziente.codiceFiscale == "" || this.data.paziente.codiceFiscale == null || this.data.paziente.codiceFiscale === undefined ||
  //    this.data.paziente.sesso == "" || this.data.paziente.sesso == null || this.data.paziente.sesso === undefined
  //  ) {

  //    var campi = "";
  //    if (this.data.paziente.cognome == "" || this.data.paziente.cognome == null || this.data.paziente.cognome === undefined) {
  //      campi = campi + " Cognome"
  //    }

  //    if (this.data.paziente.nome == "" || this.data.paziente.nome == null || this.data.paziente.nome === undefined) {
  //      campi = campi + " Nome"
  //    }

  //    if (this.data.paziente.codiceFiscale == "" || this.data.paziente.codiceFiscale == null || this.data.paziente.codiceFiscale === undefined) {
  //      campi = campi + " Codice Fiscale"
  //    }

  //    if (this.data.paziente.sesso == "" || this.data.paziente.sesso == null || this.data.paziente.sesso === undefined) {
  //      campi = campi + " Sesso"
  //    }

  //    this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
  //    return;
  //  } else {

  //    if (this.dateDiffInDays(new Date(this.data.paziente.dataNascita), new Date()) < 10) {
  //      this.messageService.showMessageError("Data di nascita Errata!!!");
  //      return;
  //    }
  //  }
  //  if (saveAndClose) {
  //    this.dialogRef.close(this.data.paziente);
  //  } else {
  //    this.uploading = true;
  //  }
  //  if (this.newItem) {
  //    this.pazienteService
  //      .insert(this.data.paziente)
  //      .then((x) => {
  //        console.log("Save paziente: ", x);
  //        this.data.paziente = x;
  //        this.paziente = x;
          
  //        this.uploading = false;
  //        this.newItem = false;
  //      })
  //      .catch((err) => {
  //        this.messageService.showMessageError(
  //          "Errore Inserimento Paziente (" + err["status"] + ")"
  //        );
  //        this.uploading = false;
  //      });
  //    let scheda: SchedaTerapeutica;
  //    scheda = new SchedaTerapeutica();
  //    scheda.firme = [];
  //    scheda.Orale = [];
  //    scheda.IMEVSC = [];
  //    scheda.Estemporanea = [];
  //    scheda.alvo = [];
  //    scheda.idPaziente = this.paziente._id;
  //    await this.schedaServ.add(scheda).then();
  //  } else {
  //    this.pazienteService
  //      .save(this.data.paziente)
  //      .then((x) => {
  //        console.log("Save paziente: ", x);
  //        this.uploading = false;
  //        this.newItem = false;
  //      })
  //      .catch((err) => {
  //        this.messageService.showMessageError(
  //          "Errore salvataggio Paziente (" + err["status"] + ")"
  //        );
  //        this.uploading = false;
  //      });
  //  }
  //  if (saveAndClose == true) this.dialogRef.close(this.data.paziente);
  //}

  showDocument(document: any) {
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

  async Close() {
   /* if (this.newItem == true)
    {
    window.location.reload();
    }*/
  }


  async changeData($event: Paziente) {
    console.log("Change paziente info", $event);
    this.paziente = $event;
  }

  async getFatture() {
    console.log(`Get Fatture paziente: ${this.paziente._id}`);
    this.fattureService
      .getByUserId(this.paziente._id)
      .then((f: Fatture[]) => {
        this.fatture = f;

        this.fattureDataSource = new MatTableDataSource<Fatture>(this.fatture);
        this.fattureDataSource.paginator = this.fatturePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }

  async deleteFattura(fattura: Fatture) {
    console.log("Cancella fattura: ", fattura);

    this.fattureService
      .remove(fattura)
      .then((x) => {
        console.log("Fattura cancellata");
        const index = this.fatture.indexOf(fattura);
        console.log("Fattura cancellata index: ", index);
        if (index > -1) {
          this.fatture.splice(index, 1);
        }

        console.log("Fattura cancellata this.fatture: ", this.fatture);
        this.fattureDataSource.data = this.fatture;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Fattura");
        console.error(err);
      });
  }

  async showFattureDocument(fattura: Fatture) {
    this.uploadService
      .download(fattura.filename, this.paziente._id, 'fatture')
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

  async addFattura() {
    this.addingFattura = true;
    this.nuovaFattura = {
      identifyUser: this.paziente._id,
      filename: undefined,
      note: ""
    };
  }

  async uploadFattura($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload fattura: ", $event);
      this.nuovaFattura.filename = file.name;
      this.nuovaFattura.file = file;

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveFattura(fattura: Fatture) {
    if (!fattura.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    console.log("saveFattura: ", fattura);
    const typeDocument = "FATTURE";
    const path = "fatture";
    const file: File = fattura.file;
    this.uploadingFattura = true;

    console.log("Invio fattura: ", fattura);
    this.fattureService
    .insert(fattura, this.paziente._id)
    .then((result: Fatture) => {
      console.log("Insert fattura: ", result);

      this.addingFattura = false;

      let formData: FormData = new FormData();

      const nameDocument: string = fattura.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.fatture.push(result);
          this.fattureDataSource.data = this.fatture;
          this.uploadingFattura = false;
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

  async showNoteCreditoDocument(notacredito: NotaCredito) {
    this.uploadService
      .download(notacredito.filename, this.paziente._id, 'notacredito')
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

  async deleteNotaCredito(notacredito: NotaCredito) {
    console.log("Cancella NotaCredito: ", notacredito);

    this.notacreditoService
      .remove(notacredito)
      .then((x) => {
        console.log("NotaCredito cancellata");
        const index = this.noteCredito.indexOf(notacredito);
        console.log("NotaCredito cancellata index: ", index);
        if (index > -1) {
          this.noteCredito.splice(index, 1);
        }

        console.log("NotaCredito cancellata this.fatture: ", this.noteCredito);
        this.noteCreditoDataSource.data = this.noteCredito;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione NotaCredito");
        console.error(err);
      });
  }

  async addNotaCredito() {
    this.addingNotaCredito = true;
    this.nuovaNotacredito = {
      identifyUser: this.paziente._id,
      filename: undefined,
      note: ""
    };
  }

  async uploadNotaCredito($event) {

    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload notacredito: ", $event);
      this.nuovaNotacredito.filename= file.name;
      this.nuovaNotacredito.file = file;

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveNotaCredito(notacredito: NotaCredito) {
    if (!notacredito.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    console.log("saveNotaCredito: ", notacredito);
    const typeDocument = "NOTACREDITO";
    const path = "notacredito";
    const file: File = notacredito.file;
    this.uploadingNotaCredito = true;

    console.log("Invio notacredito: ", notacredito);
    this.notacreditoService
        .insert(notacredito, this.paziente._id)
        .then((result: NotaCredito) => {
          console.log("Insert notacredito: ", result);
          this.noteCredito.push(result);
          this.noteCreditoDataSource.data = this.noteCredito;
          this.addingNotaCredito = false;
          this.uploadingNotaCredito = false;

          let formData: FormData = new FormData();

          const nameDocument: string = notacredito.filename;

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
          this.messageService.showMessageError("Errore Inserimento Nota Credito");
          console.error(err);
        });
  }

  async getNoteCredito() {
    console.log(`Get NotaCredito paziente: ${this.paziente._id}`);
    this.notacreditoService
      .getByUserId(this.paziente._id)
      .then((f: NotaCredito[]) => {
        this.noteCredito = f;

        this.noteCreditoDataSource = new MatTableDataSource<NotaCredito>(
          this.noteCredito
        );
        this.noteCreditoDataSource.paginator = this.notacreditoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }

  async addBonifico() {
    console.log("Add Bonifico");
    this.addingBonifici = true;
    this.nuovaBonifico = {
      identifyUser: this.paziente._id,
      filename: undefined,
      note: ""
    };
  }

  async uploadBonifico($event) {

    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload bonifico: ", $event);
      this.nuovaBonifico.filename= file.name;
      this.nuovaBonifico.file = file;

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveBonifico(bonifico: Bonifico) {
    if (!bonifico.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "BONIFICO";
    const path = "bonifico";
    const file: File = bonifico.file;
    this.uploadingBonifici = true;

    this.bonficoService
        .insert(bonifico, this.paziente._id)
        .then((result: Bonifico) => {
          console.log("Insert bonifico: ", result);
          this.bonifici.push(result);
          this.bonificiDataSource.data = this.bonifici;
          this.addingBonifici = false;
          this.uploadingBonifici = false;

          let formData: FormData = new FormData();

          const nameDocument: string = bonifico.filename;

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
          this.messageService.showMessageError("Errore Inserimento Nota Credito");
          console.error(err);
        });
  }

  async getBonificiAssegniContanti() {
    console.log(`Get Bonifici e altro paziente: ${this.paziente._id}`);
    this.bonficoService
      .getByUserId(this.paziente._id)
      .then((f: Bonifico[]) => {
        this.bonifici = f;

        this.bonificiDataSource = new MatTableDataSource<Bonifico>(this.bonifici);
        this.bonificiDataSource.paginator = this.bonificiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista bonifici e altri");
        console.error(err);
      });
  }

  async showBonificoDocument(bonifico: Bonifico) {
    this.uploadService
      .download(bonifico.filename, this.paziente._id, 'bonifico')
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

  async deleteBonifico(bonifico: Bonifico) {
    console.log("Cancella bonifico: ", bonifico);

    this.bonficoService
      .remove(bonifico)
      .then((x) => {
        console.log("Bonifici cancellata");
        const index = this.bonifici.indexOf(bonifico);
        console.log("Bonifici cancellata index: ", index);
        if (index > -1) {
          this.bonifici.splice(index, 1);
        }

        console.log("Bonifici cancellata this.bonifici: ", this.bonifici);
        this.bonificiDataSource.data = this.bonifici;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Bonifici e altro");
        console.error(err);
      });
  }

  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService
      .getFiles(this.paziente._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          this.document[doc.typeDocument] = {
            id: doc._id,
            status: true,
            name: doc.name,
            dateupload: doc.dateupload
          };
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Files");
        console.error(err);
      });
  }

  ngOnInit() {
    if (this.paziente._id != undefined) {
      this.getListFile();
      this.getFatture();
      this.getNoteCredito();
      this.getBonificiAssegniContanti();
    }
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

}
