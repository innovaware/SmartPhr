import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { FornitoreGeneraleComponent } from "src/app/component/fornitore-generale/fornitore-generale.component";
import { Bonifico } from 'src/app/models/bonifico';
import { Documento } from "src/app/models/documento";
import { Fatture } from "src/app/models/fatture";
import { DocumentoFornitore } from "src/app/models/documentoFornitore";
import { Fornitore } from "src/app/models/fornitore";
import { Observable } from "rxjs";
import { BonificoService } from 'src/app/service/bonifico.service';
import { FattureService } from "src/app/service/fatture.service";
import { DocumentoFornitoreService } from 'src/app/service/documentoFornitore.service';
import { MessagesService } from 'src/app/service/messages.service';
import { FornitoreService } from "src/app/service/fornitore.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-fornitore",
  templateUrl: "./dialog-fornitore.component.html",
  styleUrls: ["./dialog-fornitore.component.css"],
})

export class DialogFornitoreComponent implements OnInit {
  public fornitore: Fornitore;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;
  public uploadingBonifici: boolean;
  public uploadingDocumentoFornitore: boolean;
  public addingFattura: boolean;
  public addingBonifici: boolean;
  public addingDocumentoFornitore: boolean;
  public nuovaFattura: Fatture;
  public nuovaBonifico: Bonifico;
  public nuovoDocumentoFornitore: DocumentoFornitore;

  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public fattureDataSource: MatTableDataSource<Fatture>;
  public bonificiDataSource: MatTableDataSource<Bonifico>;
  public documentiFornitoreDataSource: MatTableDataSource<DocumentoFornitore>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  @ViewChild("paginatorFatture", { static: false })
  fatturePaginator: MatPaginator;
  @ViewChild("paginatorBonifici", { static: false })
  bonificiPaginator: MatPaginator;
  @ViewChild("paginatorDocumentiFornitori", { static: false })
  documentiFornitorePaginator: MatPaginator;

  public fatture: Fatture[];
  public bonifici: Bonifico[];
  public documentiFornitore: DocumentoFornitore[];
  inputSearchFieldBon: string;
  inputSearchFieldFat: string;
  inputSearchFieldDoc: string;

  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<FornitoreGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { fornitore: Fornitore; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public bonficoService: BonificoService,
    public documentoFornitoreService: DocumentoFornitoreService,
    public fornitoreService: FornitoreService,
    public messageService: MessagesService,
    public dialog: MatDialog
  ) {
    this.dialogRef.addPanelClass('fornitore-dialog-container');
    this.dialogRef.updateSize('90%', '90%');
    this.dialogRef.updatePosition({ top: '24px' });
    this.uploading = false;
    this.fornitore = this.data.fornitore;
    this.newItem = this.data.newItem || false;
    this.uploadingFattura = false;
    this.addingFattura = false;
    this.uploadingBonifici = false;
    this.addingBonifici = false;
    this.uploadingDocumentoFornitore = false;
    this.addingDocumentoFornitore = false;


    //this.fornitore = JSON.parse(JSON.stringify(this.data.fornitore));
    console.log("Dialog fornitore generale", this.data);
  }



  // a e b sono oggetti Data
  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24 * 365;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }
  async save(saveAndClose: boolean) {
    console.log("update fornitore");
    this.data.fornitore = this.fornitore;

    // Validazione campi obbligatori
    const validationError = this.validateRequiredFields();
    if (validationError) {
      this.messageService.showMessageError(validationError);
      return;
    }

    // Validazione data di nascita
    if (this.dateDiffInDays(new Date(this.fornitore.dataNascita), new Date()) < 10) {
      this.messageService.showMessageError("Data di nascita Errata!!!");
      return;
    }

    // Chiusura anticipata del dialog se richiesto
    if (saveAndClose) {
      this.dialogRef.close(this.data.fornitore);
      return;
    }

    this.uploading = true;

    try {
      const result = await (this.newItem
        ? this.fornitoreService.insert(this.data.fornitore)
        : this.fornitoreService.save(this.data.fornitore));

      console.log("Save fornitore: ", result);

      if (this.newItem) {
        this.data.fornitore = result;
        this.fornitore = result;
      }

      this.newItem = false;
      this.messageService.showMessage("Salvataggio Effettuato!!");

    } catch (err) {
      const action = this.newItem ? "Inserimento" : "salvataggio";
      this.messageService.showMessageError(
        `Errore ${action} fornitore (${err["status"]})`
      );
    } finally {
      this.uploading = false;
    }
  }

  private validateRequiredFields(): string | null {
    const fields = [
      { value: this.fornitore.cognome, name: "Cognome" },
      { value: this.fornitore.nome, name: "Nome" },
      { value: this.fornitore.codiceFiscale, name: "Codice Fiscale" },
      { value: this.fornitore.sesso, name: "Sesso" }
    ];

    const missingFields = fields
      .filter(field => !field.value || field.value.trim() === "")
      .map(field => field.name);

    if (missingFields.length > 0) {
      return `I campi ${missingFields.join(", ")} sono obbligatori!!`;
    }

    return null;
  }

  private isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
  }


  async changeData($event: Fornitore) {
    console.log("Change fornitore info", $event);
    this.fornitore = $event;
  }

  async getFatture() {
    console.log(`Get Fatture fornitore: ${this.fornitore._id}`);
    this.fattureService
      .getByUserId(this.fornitore._id)
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
      .download(fattura.filename, this.fornitore._id, 'fatture')
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
      identifyUser: this.fornitore._id,
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
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    const typeDocument = "FATTURE";
    const path = "fatture";
    const file: File = fattura.file;
    this.uploadingFattura = true;

    console.log("Invio fattura: ", fattura);
    this.fattureService
      .insert(fattura, this.fornitore._id)
      .then((result: Fatture) => {
        console.log("Insert fattura: ", result);

        this.addingFattura = false;

        let formData: FormData = new FormData();
        const nameDocument: string = fattura.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.fornitore._id}/${path}`);
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

  async addBonifico() {
    console.log("Add Bonifico");
    this.addingBonifici = true;
    this.nuovaBonifico = {
      identifyUser: this.fornitore._id,
      filename: undefined,
      note: ""
    };
  }
  annulla(type:string) {
    switch (type) {
      case "Bonifico":
        this.addingBonifici = false;
        break;
      case "Fattura":
        this.addingFattura = false;
        break;
      case "Documento":
        this.addingDocumentoFornitore = false;
        break;
    }
  }
  async uploadBonifico($event) {

    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload bonifico: ", $event);
      this.nuovaBonifico.filename = file.name;
      this.nuovaBonifico.file = file;

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveBonifico(bonifico: Bonifico) {
    if (!bonifico.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    const typeDocument = "BONIFICO";
    const path = "bonifico";
    const file: File = bonifico.file;
    this.uploadingBonifici = true;

    this.bonficoService
      .insert(bonifico, this.fornitore._id)
      .then((result: Bonifico) => {
        console.log("Insert bonifico 1: ", result);
        this.bonifici.push(result);
        this.bonificiDataSource.data = this.bonifici;
        this.addingBonifici = false;
        this.uploadingBonifici = false;

        let formData: FormData = new FormData();

        const nameDocument: string = bonifico.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.fornitore._id}/${path}`);
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
        this.messageService.showMessageError("Errore Inserimento Bonifico");
        console.error(err);
      });
  }

  async getBonificiAssegniContanti() {
    console.log(`Get Bonifici e altro fornitore: ${this.fornitore._id}`);
    this.bonficoService
      .getByUserId(this.fornitore._id)
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
      .download(bonifico.filename, this.fornitore._id, 'bonifico')
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
    console.log(`Get list files fornitore: ${this.fornitore._id}`);
    this.uploadService
      .getFiles(this.fornitore._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          console.log("document:", doc);
          this.document[doc.typeDocument] = {
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
    if (this.fornitore._id != undefined) {
      this.getListFile();
      this.getFatture();
      this.getBonificiAssegniContanti();
      this.getDocumentiFornitore();
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
      formData.append("path", `${this.fornitore._id}`);
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
        .then((x) => {
          this.uploading = false;

          this.document[typeDocument] = {
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

  async getDocumentiFornitore() {
    console.log(`Get Documenti fornitore: ${this.fornitore._id}`);
    this.documentoFornitoreService
      .getDocumentoFornitore(this.fornitore._id)
      .then((d: DocumentoFornitore[]) => {
        this.documentiFornitore = d;

        this.documentiFornitoreDataSource = new MatTableDataSource<DocumentoFornitore>(this.documentiFornitore);
        this.documentiFornitoreDataSource.paginator = this.documentiFornitorePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista documenti");
        console.error(err);
      });
  }

  async deleteDocumentoFornitore(documentoFornitore: DocumentoFornitore) {
    console.log("Cancella documento: ", documentoFornitore);

    this.documentoFornitoreService
      .remove(documentoFornitore)
      .then((x) => {
        console.log("Documento cancellato");
        const index = this.documentiFornitore.indexOf(documentoFornitore);

        if (index > -1) {
          this.documentiFornitore.splice(index, 1);
        }

        console.log("Documento cancellato this.documenti: ", this.documentiFornitore);
        this.documentiFornitoreDataSource.data = this.documentiFornitore;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Documento");
        console.error(err);
      });
  }

  async showDocumentoFornitoreDocument(documentoFornitore: DocumentoFornitore) {
    this.uploadService
      .download(documentoFornitore.filename, this.fornitore._id, 'documentoFornitore')
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

  async addDocumentoFornitore() {
    console.log("Add DocumentoFornitore");
    this.addingDocumentoFornitore = true;
    this.nuovoDocumentoFornitore = {
      filename: undefined,
      note: ""
    };
  }

  async uploadDocumentoFornitore($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];


      this.nuovoDocumentoFornitore.filename = file.name;
      this.nuovoDocumentoFornitore.file = file;

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveDocumentoFornitore(documentoFornitore: DocumentoFornitore) {
    if (!documentoFornitore.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    const typeDocument = "DOCUMENTO FORNITORE";
    const path = "documentoFornitore";
    const file: File = documentoFornitore.file;
    this.uploadingDocumentoFornitore = true;

    console.log("Invio documento: ", documentoFornitore);
    this.documentoFornitoreService
      .insertDocumentoFornitore(documentoFornitore, this.fornitore._id)
      .then((result: DocumentoFornitore) => {
        console.log("Insert documento 2: ", result);
        this.documentiFornitore.push(result);
        this.documentiFornitoreDataSource.data = this.documentiFornitore;
        this.addingDocumentoFornitore = false;
        this.uploadingDocumentoFornitore = false;

        let formData: FormData = new FormData();

        const nameDocument: string = documentoFornitore.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.fornitore._id}/${path}`);
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
        this.messageService.showMessageError("Errore Inserimento documento");
        console.error(err);
      });
  }

  cleanSearchField(type: string): void {
    switch (type) {
      case "Bonifici":
        this.bonificiDataSource.filter = '';
        this.inputSearchFieldBon = '';
        break;
      case "Fattura":
        this.fattureDataSource.filter = '';
        this.inputSearchFieldFat = '';
        break;
      case "Documenti":
        this.documentiFornitoreDataSource.filter = '';
        this.inputSearchFieldDoc = '';
        break;
    }
  }

  applyFilter(event: Event, type: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    switch (type) {
      case "Bonifici":
        this.bonificiDataSource.filter = filterValue;
        break;
      case "Fattura":
        this.fattureDataSource.filter = filterValue;
        break;
      case "Documenti":
        this.documentiFornitoreDataSource.filter = filterValue;
        break;
    }
  }
}
