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
import { DocumentoMedicinaLavoro } from "src/app/models/documentoMedicinaLavoro";

import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Dipendenti } from "src/app/models/dipendenti";

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



  DisplayedRichiesteColumns: string[] = ["date", "action"];
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  DisplayedColumnsCertMalattia: string[] = ["descrizione", "namefile", "date", "note", "action"];
  DisplayedColumnsMedicinaLavoro : string[] = ["filenameRichiesta", "dateuploadRichiesta", "noteRichiesta","filenameCertificato", "dateuploadCertificato", "noteCertificato", "action"];

 
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


  @ViewChild("paginatorDocIdent", { static: false }) docIdentitaPaginator: MatPaginator;
  public nuovoDocumentoIdentita: DocumentoDipendente;
  public docIdentitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsIdentita : DocumentoDipendente[];
  public uploadingDocIdentita: boolean;
  public addingDocIdentita: boolean;



  @ViewChild("paginatorContratto", { static: false }) contrattoPaginator: MatPaginator;
  public nuovoContratto: DocumentoDipendente;
  public contrattiDataSource: MatTableDataSource<DocumentoDipendente>;
  public contratti : DocumentoDipendente[];
  public uploadingContratto: boolean;
  public addingContratto: boolean;



  @ViewChild("paginatorPrivacy", { static: false }) privacyPaginator: MatPaginator;
  public nuovoPrivacy: DocumentoDipendente;
  public docsprivacyDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsprivacy : DocumentoDipendente[];
  public uploadingPrivacy: boolean;
  public addingPrivacy: boolean;


  @ViewChild("paginatorDiploma", { static: false }) diplomaPaginator: MatPaginator;
  public nuovoDiploma: DocumentoDipendente;
  public diplomiDataSource: MatTableDataSource<DocumentoDipendente>;
  public diplomi : DocumentoDipendente[];
  public uploadingDiploma: boolean;
  public addingDiploma: boolean;


  @ViewChild("paginatorAttestatiECM", { static: false }) attestatiPaginator: MatPaginator;
  public nuovoAttestatoECM: DocumentoDipendente;
  public attestatiECMDataSource: MatTableDataSource<DocumentoDipendente>;
  public attestati : DocumentoDipendente[];
  public uploadingAttestatoECM: boolean;
  public addingAttestatoECM: boolean;



  @ViewChild("paginatorCedolini", { static: false })
  cedoliniPaginator: MatPaginator;
  public cedoliniDataSource: MatTableDataSource<DocumentoDipendente>;
  public cedolini : DocumentoDipendente[];

  @ViewChild("paginatorRichieste", { static: false })
  richiestePaginator: MatPaginator;
  public richiesteDataSource: MatTableDataSource<DocumentoDipendente>;
  public richieste : DocumentoDipendente[];



  @ViewChild("paginatordocsMedicina", { static: false })
  docsMedicinaPaginator: MatPaginator;
  public docsMedicinaDataSource: MatTableDataSource<DocumentoMedicinaLavoro>;
  public docsMedicina : DocumentoMedicinaLavoro[];


  @ViewChild("paginatorCertificatoMalattia", { static: false })
  certificatiMalattiaPaginator: MatPaginator;
  public nuovoCertificatoMalattia: DocumentoDipendente;
  public certificatiMalattiaDataSource: MatTableDataSource<DocumentoDipendente>;
  public certificatiMalattia : DocumentoDipendente[];
  public uploadingCertificatoMalattia: boolean;
  public addingCertificatoMalattia: boolean;




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
      this.getDiplomi();
      this.getAttestatiECM();
      this.getCedolini();
      this.getDocMedicinaLav();
      this.getCertificatoMalattia();
     
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





  // CERTIFICATI MALATTIA
  async addCertificatoMalattia() {
    this.addingCertificatoMalattia = true;
    this.nuovoCertificatoMalattia = {
      filename: undefined,
      note: "",
      type: 'CertificatoMalattia',
      filenameesito: ''
    };
  }

  async uploadCertificatoMalattia($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoCertificatoMalattia.filename = file.name;
      this.nuovoCertificatoMalattia.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteCertificatoMalattia(doc: DocumentoDipendente) {
    console.log("Cancella Certificato Malattia: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Certificato Malattia cancellata");
        const index = this.certificatiMalattia.indexOf(doc);
        console.log("Certificato Malattia cancellata index: ", index);
        if (index > -1) {
          this.certificatiMalattia.splice(index, 1);
        }

        console.log("Certificato Malattia cancellata this.fatture: ", this.certificatiMalattia);
        this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async saveCertificatoMalattia(doc: DocumentoDipendente) {
    const typeDocument = "CertificatoMalattia";
    const path = "CertificatoMalattia";
    const file: File = doc.file;
    this.uploadingCertificatoMalattia = true;

    console.log("Invio CertificatoMalattia: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert CertificatoMalattia: ", result);
      this.certificatiMalattia.push(result);
      this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
      this.addingCertificatoMalattia = false;
      this.uploadingCertificatoMalattia = false;

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
      this.showMessageError("Errore Inserimento CertificatoMalattia");
      console.error(err);
    });
  }

  showEsit(doc: DocumentoDipendente){}

  async getCertificatoMalattia() {
    console.log(`get CertificatoMalattia dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'CertificatoMalattia')
      .then((f: DocumentoDipendente[]) => {
        this.certificatiMalattia = f;

        this.certificatiMalattiaDataSource = new MatTableDataSource<DocumentoDipendente>(this.certificatiMalattia);
        this.certificatiMalattiaDataSource.paginator = this.certificatiMalattiaPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista CERTIFICATI MALATTIA");
        console.error(err);
      });
  }


  // FINE CERTIFICATI MALATTIA


  // DOCUMENTI MEDICNA LAVORO


  async getDocMedicinaLav() {
    console.log(`get DocMedicinaLav dipendente: ${this.dipendente._id}`);
    this.docService
      .getDocMedicinaLavoro(this.dipendente)
      .then((f: DocumentoMedicinaLavoro[]) => {
        this.docsMedicina = f;

        this.docsMedicinaDataSource = new MatTableDataSource<DocumentoMedicinaLavoro>(this.docsMedicina);
        this.docsMedicinaDataSource.paginator = this.docsMedicinaPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista DocMedicinaLav");
        console.error(err);
      });
  }



  async showDocumentRichiesta(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocMedicinaLavoro(doc.filenameRichiesta, 'medicinaLavoro', this.dipendente)
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



  async showDocumentCertificato(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocDipendente(doc.filenameCertificato, 'medicinaLavoro', this.dipendente)
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




  // PRIVACY
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


  // FINE PRIVACY







   // DIPLOMA 
   async addDiploma() {
    this.addingDiploma = true;
    this.nuovoDiploma = {
      filename: undefined,
      note: "",
      type: 'Diploma'
    };
  }

  async uploadDiploma($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Diploma: ", $event);
      this.nuovoDiploma.filename = file.name;
      this.nuovoDiploma.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteDiploma(doc: DocumentoDipendente) {
    console.log("Cancella Diploma: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Diploma cancellata");
        const index = this.diplomi.indexOf(doc);
        console.log("Diploma cancellata index: ", index);
        if (index > -1) {
          this.diplomi.splice(index, 1);
        }

        console.log("Diploma cancellata : ", this.diplomi);
        this.diplomiDataSource.data = this.diplomi;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione Diploma");
        console.error(err);
      });
  }
  
  async saveDiploma(doc: DocumentoDipendente) {
    const typeDocument = "Diploma";
    const path = "Diploma";
    const file: File = doc.file;
    this.uploadingDiploma = true;

    console.log("Invio Diploma: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert Diploma: ", result);
      this.diplomi.push(result);
      this.diplomiDataSource.data = this.diplomi;
      this.addingDiploma = false;
      this.uploadingDiploma = false;

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



  async getDiplomi() {
    console.log(`get Diplomi dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'Diploma')
      .then((f: DocumentoDipendente[]) => {
        this.diplomi = f;

        this.diplomiDataSource = new MatTableDataSource<DocumentoDipendente>(this.diplomi);
        this.diplomiDataSource.paginator = this.diplomaPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista Diplomi");
        console.error(err);
      });
  }


  // FINE DIPLOMA





  // DIPLOMA 
  async addAttestatoECM() {
    this.addingAttestatoECM = true;
    this.nuovoAttestatoECM = {
      filename: undefined,
      note: "",
      type: 'AttestatoECM'
    };
  }

  async uploadAttestatoECM($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload AttestatoECM: ", $event);
      this.nuovoAttestatoECM.filename = file.name;
      this.nuovoAttestatoECM.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteAttestatoECM(doc: DocumentoDipendente) {
    console.log("Cancella AttestatoECM: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("AttestatoECM cancellata");
        const index = this.attestati.indexOf(doc);
        console.log("AttestatoECM cancellata index: ", index);
        if (index > -1) {
          this.attestati.splice(index, 1);
        }

        console.log("AttestatoECM cancellata : ", this.attestati);
        this.attestatiECMDataSource.data = this.attestati;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione AttestatoECM");
        console.error(err);
      });
  }
  
  async saveAttestatoECM(doc: DocumentoDipendente) {
    const typeDocument = "AttestatoECM";
    const path = "AttestatoECM";
    const file: File = doc.file;
    this.uploadingAttestatoECM = true;

    console.log("Invio AttestatoECM: ", doc);
    this.docService
    .insert(doc, this.dipendente)
    .then((result: DocumentoDipendente) => {
      console.log("Insert AttestatoECM: ", result);
      this.attestati.push(result);
      this.attestatiECMDataSource.data = this.attestati;
      this.addingAttestatoECM = false;
      this.uploadingAttestatoECM = false;

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
      this.showMessageError("Errore Inserimento Documento");
      console.error(err);
    });
  }



  async getAttestatiECM() {
    console.log(`get AttestatiECM dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'Diploma')
      .then((f: DocumentoDipendente[]) => {
        this.attestati = f;

        this.attestatiECMDataSource = new MatTableDataSource<DocumentoDipendente>(this.attestati);
        this.attestatiECMDataSource.paginator = this.attestatiPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista attestatiECM");
        console.error(err);
      });
  }


  // FINE ATTESTATI ECM




  // CEDOLINI

  async getCedolini() {
    console.log(`get Cedolini dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, 'Cedolini')
      .then((f: DocumentoDipendente[]) => {
        this.cedolini = f;

        this.cedoliniDataSource = new MatTableDataSource<DocumentoDipendente>(this.cedolini);
        this.cedoliniDataSource.paginator = this.cedoliniPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista cedolini");
        console.error(err);
      });
  }


  // FINE CEDOLINI

}
