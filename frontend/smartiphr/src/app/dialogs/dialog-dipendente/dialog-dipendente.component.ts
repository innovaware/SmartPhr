import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { DipendenteGeneraleComponent } from "src/app/component/dipendente-generale/dipendente-generale.component";
import { Bonifico } from 'src/app/models/bonifico';
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Dipendenti } from "src/app/models/dipendenti";
import { BonificoService } from 'src/app/service/bonifico.service';
import { FattureService } from "src/app/service/fatture.service";
import { NotaCreditoService } from "src/app/service/notacredito.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { DocumentiService } from "src/app/service/documenti.service";

@Component({
  selector: 'app-dialog-dipendente',
  templateUrl: './dialog-dipendente.component.html',
  styleUrls: ['./dialog-dipendente.component.css']
})
export class DialogDipendenteComponent implements OnInit {
 
  
  public dipendente: Dipendenti;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;
  public uploadingNotaCredito: boolean;

  public addingNotaCredito: boolean;
  public addingBonifici: boolean;

  public nuovaFattura: Fatture;
  public nuovaNotacredito: NotaCredito;
  public nuovaBonifico: Bonifico;




  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

 
  public noteCreditoDataSource: MatTableDataSource<NotaCredito>;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
 
  @ViewChild("paginatorNoteCredito", { static: false })
  notacreditoPaginator: MatPaginator;
  @ViewChild("paginatorBonifici", { static: false })
  bonificiPaginator: MatPaginator;

  public fatture: Fatture[];
  public noteCredito: NotaCredito[];
  public bonifici: Bonifico[];


  @ViewChild("paginatorDocIdent", { static: false })
  docIdentitaPaginator: MatPaginator;
  public nuovoDocumentoIdentita: DocumentoDipendente;
  public docIdentitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsIdentita : DocumentoDipendente[];
  public uploadingDocIdentita: boolean;
  public addingDocIdentita: boolean;



  @ViewChild("paginatorContratto", { static: false })
  contrattoPaginator: MatPaginator;
  public nuovoContratto: DocumentoDipendente;
  public contrattiDataSource: MatTableDataSource<DocumentoDipendente>;
  public contratti : DocumentoDipendente[];
  public uploadingContratto: boolean;
  public addingContratto: boolean;



  @ViewChild("paginatorPrivacy", { static: false })
  privacyPaginator: MatPaginator;
  public nuovoPrivacy: DocumentoDipendente;
  public docsprivacyDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsprivacy : DocumentoDipendente[];
  public uploadingPrivacy: boolean;
  public addingPrivacy: boolean;




  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<DipendenteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { dipendente: Dipendenti; readonly: boolean; newItem: boolean },
    public docService: DocumentiService,
    /*public notacreditoService: NotaCreditoService,
    public bonficoService: BonificoService,*/
    public dipendenteService: DipendentiService,
    public dialog: MatDialog
  ) {
    this.uploading = false;
    this.dipendente = this.data.dipendente;
    this.newItem = this.data.newItem || false;



    
    this.uploadingDocIdentita = false;
    this.addingDocIdentita = false;


    //this.dipendente = JSON.parse(JSON.stringify(this.data.dipendente));
    console.log("Dialog dipendente generale", this.data);
  }

  async save(saveAndClose: boolean) {
    // this.data.dipendente = this.dipendente;
    console.log("update dipendente");
    this.data.dipendente.cognome = this.dipendente.cognome;
    this.data.dipendente.nome = this.dipendente.nome;
    this.data.dipendente.cf = this.dipendente.cf;
    this.data.dipendente.dataNascita = this.dipendente.dataNascita;
    this.data.dipendente.comuneNascita = this.dipendente.comuneNascita;
    this.data.dipendente.indirizzoNascita = this.dipendente.indirizzoNascita;
    this.data.dipendente.provinciaNascita = this.dipendente.provinciaNascita;
    this.data.dipendente.indirizzoResidenza = this.dipendente.indirizzoResidenza;
    this.data.dipendente.residenza = this.dipendente.residenza;
    this.data.dipendente.provinciaResidenza = this.dipendente.provinciaResidenza;
    this.data.dipendente.titoloStudio = this.dipendente.titoloStudio;
    this.data.dipendente.mansione = this.dipendente.mansione;
    this.data.dipendente.contratto = this.dipendente.contratto;
    this.data.dipendente.telefono = this.dipendente.telefono;
    this.data.dipendente.email = this.dipendente.email;
   

    if (saveAndClose) {
      this.dialogRef.close(this.data.dipendente);
    } else {
      this.uploading = true;

      if (this.newItem) {
        this.dipendenteService
          .insert(this.data.dipendente)
          .then((x) => {
            console.log("Save dipendente: ", x);
            this.data.dipendente = x;
            this.dipendente = x;
            this.uploading = false;
            this.newItem = false;
          })
          .catch((err) => {
            this.showMessageError(
              "Errore Inserimento dipendente (" + err["status"] + ")"
            );
            this.uploading = false;
          });
      } else {
        this.dipendenteService
          .save(this.data.dipendente)
          .then((x) => {
            console.log("Save dipendente: ", x);
            this.uploading = false;
            this.newItem = false;
          })
          .catch((err) => {
            this.showMessageError(
              "Errore salvataggio dipendente (" + err["status"] + ")"
            );
            this.uploading = false;
          });
      }
    }
  }




  



  ngOnInit() {
    if (this.dipendente._id != undefined) {
      this.getDocIdentita();
      this.getContratti();
      this.getDocsPrivacy();
     
    }
  }




  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
  }






  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, this.dipendente)
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
        this.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }


  

  // DOCUMENTI IDENTITA
  async addDocIdentita() {
    this.addingDocIdentita = true;
    this.nuovoDocumentoIdentita = {
      filename: undefined,
      note: "",
      type: 'DocumentoIdentita'
    };
  }

  async uploadDocIdentita($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoDocumentoIdentita.filename = file.name;
      this.nuovoDocumentoIdentita.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteDocIdentita(doc: DocumentoDipendente) {
    console.log("Cancella doc identita: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("doc identita cancellata");
        const index = this.docsIdentita.indexOf(doc);
        console.log("doc identita cancellata index: ", index);
        if (index > -1) {
          this.docsIdentita.splice(index, 1);
        }

        console.log("doc identita cancellata this.fatture: ", this.docsIdentita);
        this.docIdentitaDataSource.data = this.docsIdentita;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async saveDocIdentita(doc: DocumentoDipendente) {
    const typeDocument = "DocumentoIdentita";
    const path = "DocumentoIdentita";
    const file: File = doc.file;
    this.uploadingDocIdentita = true;

    console.log("Invio doc identita: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert doc identita: ", result);
      this.docsIdentita.push(result);
      this.docIdentitaDataSource.data = this.docsIdentita;
      this.addingDocIdentita = false;
      this.uploadingDocIdentita = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.dipendente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getDocIdentita() {
    console.log(`get DocIdentita dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'DocumentoIdentita')
      .then((f: DocumentoDipendente[]) => {
        this.docsIdentita = f;

        this.docIdentitaDataSource = new MatTableDataSource<DocumentoDipendente>(this.docsIdentita);
        this.docIdentitaDataSource.paginator = this.docIdentitaPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }


  // FINE DOCUMENTI IDENTITA




  // CONTRATTI
  async addContratto() {
    this.addingContratto = true;
    this.nuovoContratto = {
      filename: undefined,
      note: "",
      type: 'Contratto'
    };
  }

  async uploadContratto($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload contratto: ", $event);
      this.nuovoContratto.filename = file.name;
      this.nuovoContratto.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteContratto(doc: DocumentoDipendente) {
    console.log("Cancella Contratto: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Contratto cancellata");
        const index = this.contratti.indexOf(doc);
        console.log("Contratto cancellata index: ", index);
        if (index > -1) {
          this.contratti.splice(index, 1);
        }

        console.log("Contratto cancellata this.fatture: ", this.contratti);
        this.contrattiDataSource.data = this.contratti;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async saveContratto(doc: DocumentoDipendente) {
    const typeDocument = "Contratto";
    const path = "Contratto";
    const file: File = doc.file;
    this.uploadingContratto = true;

    console.log("Invio Contratto: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert Contratto: ", result);
      this.contratti.push(result);
      this.contrattiDataSource.data = this.contratti;
      this.addingContratto = false;
      this.uploadingContratto = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.dipendente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getContratti() {
    console.log(`get Contratto dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'Contratto')
      .then((f: DocumentoDipendente[]) => {
        this.contratti = f;

        this.contrattiDataSource = new MatTableDataSource<DocumentoDipendente>(this.contratti);
        this.contrattiDataSource.paginator = this.contrattoPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista Contratto");
        console.error(err);
      });
  }


  // FINE CONTRATTI




  // CONTRATTI
  async addPrivacy() {
    this.addingPrivacy = true;
    this.nuovoPrivacy = {
      filename: undefined,
      note: "",
      type: 'Privacy'
    };
  }

  async uploadPrivacy($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Privacy: ", $event);
      this.nuovoPrivacy.filename = file.name;
      this.nuovoPrivacy.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deletePrivacy(doc: DocumentoDipendente) {
    console.log("Cancella Privacy: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Privacy cancellata");
        const index = this.docsprivacy.indexOf(doc);
        console.log("Privacy cancellata index: ", index);
        if (index > -1) {
          this.docsprivacy.splice(index, 1);
        }

        console.log("Privacy cancellata : ", this.docsprivacy);
        this.docsprivacyDataSource.data = this.docsprivacy;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione Privacy");
        console.error(err);
      });
  }
  
  async savePrivacy(doc: DocumentoDipendente) {
    const typeDocument = "Privacy";
    const path = "Privacy";
    const file: File = doc.file;
    this.uploadingPrivacy = true;

    console.log("Invio Privacy: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert Privacy: ", result);
      this.docsprivacy.push(result);
      this.docsprivacyDataSource.data = this.docsprivacy;
      this.addingPrivacy = false;
      this.uploadingPrivacy = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.dipendente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getDocsPrivacy() {
    console.log(`get Privacy dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'Privacy')
      .then((f: DocumentoDipendente[]) => {
        this.docsprivacy = f;

        this.docsprivacyDataSource = new MatTableDataSource<DocumentoDipendente>(this.docsprivacy);
        this.docsprivacyDataSource.paginator = this.contrattoPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista Privacy");
        console.error(err);
      });
  }


  // FINE CONTRATTI

}
