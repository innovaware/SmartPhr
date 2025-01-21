import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { DipendenteGeneraleComponent } from "src/app/component/dipendente-generale/dipendente-generale.component";
import { Bonifico } from "src/app/models/bonifico";
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { DocumentoMedicinaLavoro } from "src/app/models/documentoMedicinaLavoro";

import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Dipendenti } from "src/app/models/dipendenti";

import { DipendentiService } from "src/app/service/dipendenti.service";
import { UploadService } from "src/app/service/upload.service";
import { DocumentiService } from "src/app/service/documenti.service";
import { DialogCaricadocumentoComponent } from "../dialog-caricadocumento/dialog-caricadocumento.component";
import { MessagesService } from "src/app/service/messages.service";
import { UsersService } from "src/app/service/users.service";
import { Ferie } from "src/app/models/ferie";
import { FerieService } from "src/app/service/ferie.service";
import { PermessiService } from "src/app/service/permessi.service";
import { Permessi } from "src/app/models/permessi";
import { CambiturniService } from "src/app/service/cambiturni.service";
import { Cambiturno } from "src/app/models/cambiturni";
import { Presenze } from "src/app/models/presenze";
import { PresenzeService } from "src/app/service/presenze.service";
import { DialogCaricadocumentoMedicinaComponent } from "../dialog-caricadocumentoMedicina/dialog-caricadocumentoMedicina.component";
import { User } from "../../models/user";

@Component({
  selector: "app-dialog-dipendente",
  templateUrl: "./dialog-dipendente.component.html",
  styleUrls: ["./dialog-dipendente.component.css"],
})
export class DialogDipendenteComponent implements OnInit {
  public dipendente: Dipendenti;
  public fatture: Fatture[];
  public noteCredito: NotaCredito[];
  public bonifici: Bonifico[];
  public ferie: Ferie[];
  public permessi: Permessi[];
  public cambioTurni: Cambiturno[];
  public presenze: Presenze[];
  public admin: Boolean = true;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;
  public uploadingNotaCredito: boolean;
  public user: User;
  public addingNotaCredito: boolean;
  public addingBonifici: boolean;

  public nuovaFattura: Fatture;
  public nuovaNotacredito: NotaCredito;
  public nuovaBonifico: Bonifico;
  public nuovoMedicina: DocumentoMedicinaLavoro;


  DisplayedRichiesteColumns: string[] = ["date", "action"];
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  DisplayedColumnsCertMalattia: string[] = [
    "descrizione",
    "namefile",
    "date",
    "note",
    "action",
  ];
  DisplayedColumnsMedicinaLavoro: string[] = [
    "filenameRichiesta",
    "dateuploadRichiesta",
    "noteRichiesta",
    "filenameCertificato",
    "dateuploadCertificato",
    "noteCertificato",
    "actionReq",
    "actionCert",
  ];

  public noteCreditoDataSource: MatTableDataSource<NotaCredito>;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;

  @ViewChild("paginatorNoteCredito", { static: false })
  notacreditoPaginator: MatPaginator;
  @ViewChild("paginatorBonifici", { static: false })
  bonificiPaginator: MatPaginator;


  @ViewChild("paginatorDocIdent", { static: false })
  docIdentitaPaginator: MatPaginator;
  public nuovoDocumentoIdentita: DocumentoDipendente;
  public docIdentitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsIdentita: DocumentoDipendente[];
  public uploadingDocIdentita: boolean;
  public addingDocIdentita: boolean;

  @ViewChild("paginatorContratto", { static: false })
  contrattoPaginator: MatPaginator;
  public nuovoContratto: DocumentoDipendente;
  public contrattiDataSource: MatTableDataSource<DocumentoDipendente>;
  public contratti: DocumentoDipendente[];
  public uploadingContratto: boolean;
  public addingContratto: boolean;

  @ViewChild("paginatorPrivacy", { static: false })
  privacyPaginator: MatPaginator;
  public nuovoPrivacy: DocumentoDipendente;
  public docsprivacyDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsprivacy: DocumentoDipendente[];
  public uploadingPrivacy: boolean;
  public addingPrivacy: boolean;

  @ViewChild("paginatorDiploma", { static: false })
  diplomaPaginator: MatPaginator;
  public nuovoDiploma: DocumentoDipendente;
  public diplomiDataSource: MatTableDataSource<DocumentoDipendente>;
  public diplomi: DocumentoDipendente[];
  public uploadingDiploma: boolean;
  public addingDiploma: boolean;

  @ViewChild("paginatorAttestatiECM", { static: false })
  attestatiPaginator: MatPaginator;
  public nuovoAttestatoECM: DocumentoDipendente;
  public attestatiECMDataSource: MatTableDataSource<DocumentoDipendente>;
  public attestati: DocumentoDipendente[];
  public uploadingAttestatoECM: boolean;
  public addingAttestatoECM: boolean;

  @ViewChild("paginatorCedolini", { static: false })
  cedoliniPaginator: MatPaginator;
  public cedoliniDataSource: MatTableDataSource<DocumentoDipendente>;
  public cedolini: DocumentoDipendente[];
  public uploadingCedolino: boolean;
  public addingCedolino: boolean;
  public nuovoCedolino: DocumentoDipendente;

  @ViewChild("paginatorRichieste", { static: false })
  richiestePaginator: MatPaginator;
  public richiesteDataSource: MatTableDataSource<DocumentoDipendente>;
  public richieste: DocumentoDipendente[];

  @ViewChild("paginatordocsMedicina", { static: false })
  docsMedicinaPaginator: MatPaginator;
  public docsMedicinaDataSource: MatTableDataSource<DocumentoMedicinaLavoro>;
  public docsMedicina: DocumentoMedicinaLavoro[];
  public uploadingMedicina: boolean;
  public addingMedicina: boolean;

  @ViewChild("paginatorCertificatoMalattia", { static: false })
  certificatiMalattiaPaginator: MatPaginator;
  public nuovoCertificatoMalattia: DocumentoDipendente;
  public certificatiMalattiaDataSource: MatTableDataSource<DocumentoDipendente>;
  public certificatiMalattia: DocumentoDipendente[];
  public uploadingCertificatoMalattia: boolean;
  public addingCertificatoMalattia: boolean;


  tabLabels: { index: number, init: any, key: string, label: string }[] = [
    { index: 0, init: () => { }, key: 'DatiGenerali', label: "Dati anagrafici generale" },
    { index: 1, init: () => this.loadUserCred(), key: 'GestUtenza', label: "Gest. Utenza" },
    { index: 2, init: () => this.getDocIdentita(), key: 'DocumentiIdentità', label: "Documenti d'identità" },
    { index: 3, init: () => this.getDocMedicinaLav(), key: 'MedicinaLavoro', label: 'Medicina del lavoro' },
    { index: 4, init: () => this.getContratti(), key: 'ContrattiLavoro', label: 'Contratti di lavoro' },
    { index: 5, init: () => this.getDocsPrivacy(), key: 'Privacy', label: 'Privacy' },
    { index: 6, init: () => this.getDiplomi(), key: 'DiplomiAttestati', label: 'Diplomi e attestati' },
    { index: 7, init: () => this.getAttestatiECM(), key: 'AttestatiECM', label: 'Attestati ECM' },
    { index: 8, init: () => this.getCedolini(), key: 'CedoliniCU', label: 'Cedolini e CU' },
    { index: 9, init: () => this.getCertificatoMalattia(), key: 'CertificatiMalattia', label: 'Certificati malattia' },
    { index: 10, init: () => { }, key: 'RegolamentoInterno', label: 'Regolamento interno' },
    { index: 11, init: () => this.getRichiesteMaterialiPresidi(), key: 'RichiesteMaterialePresidi', label: 'Richieste materiale o presidi' },
    { index: 12, init: () => this.getFerie(), key: 'Ferie', label: 'Ferie' },
    { index: 13, init: () => this.getPermessi(), key: 'Permessi', label: 'Permessi' },
    { index: 14, init: () => this.getCambioTurni(), key: 'CambiTurno', label: 'Cambi turno' },
    //{ index: 15, init: () => this.getPresenze(), key: 'Presenze', label: 'Presenze' },
    //{ index: 16, init: () => { }, key: 'TurniMensili', label: 'Turni mensili' },
  ];

  constructor(
    public messageService: MessagesService,
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<DipendenteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      dipendente: Dipendenti;
      readonly: boolean;
      newItem: boolean;
    },
    public docService: DocumentiService,
    /*public notacreditoService: NotaCreditoService,
    public bonficoService: BonificoService,*/
    public dipendenteService: DipendentiService,
    public usersService: UsersService,
    public dialog: MatDialog,
    private ferieService: FerieService,
    private permessiService: PermessiService,
    private cambiturniService: CambiturniService,
    private presenzeService: PresenzeService,

  ) {
    this.dialogRef.addPanelClass('fornitore-dialog-container');
    this.dialogRef.updateSize('90%', '90%');
    this.dialogRef.updatePosition({ top: '24px' });
    this.uploading = false;
    this.dipendente = this.data.dipendente;
    this.newItem = this.data.newItem || false;
    this.user = new User();
    this.uploadingDocIdentita = false;
    this.addingDocIdentita = false;

    this.uploadingMedicina = false;
    this.addingMedicina = false;
    this.nuovoMedicina = new DocumentoMedicinaLavoro();

    
    this.cedoliniDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.cedolini = [];
    this.uploadingCedolino = false;
    this.addingCedolino = false;
    this.nuovoCedolino = new DocumentoDipendente();

    //this.dipendente = JSON.parse(JSON.stringify(this.data.dipendente));
    this.loadUserCred();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    const item = this.tabLabels.find(i => i.index === tabChangeEvent.index);
    if (item !== undefined) {
      item.init();
    }
  }

  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24 * 365;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  loadUserCred() {
    if (!this.dipendente || !this.dipendente._id) return;
    this.usersService
      .getByDipendenteId(this.dipendente._id)
      .then((x:User) => {
        this.user = x[0];
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore Caricamento dipendente (" + err["status"] + ")"
        );
      });
  }


  async save(saveAndClose: boolean) {
    

    // this.data.dipendente = this.dipendente;
    console.log("insert dipendente");
    this.data.dipendente.cognome = this.dipendente.cognome;
    this.data.dipendente.nome = this.dipendente.nome;
    this.data.dipendente.cf = this.dipendente.cf;
    this.data.dipendente.sesso = this.dipendente.sesso;
    this.data.dipendente.dataNascita = this.dipendente.dataNascita;
    this.data.dipendente.comuneNascita = this.dipendente.comuneNascita;
    this.data.dipendente.indirizzoNascita = this.dipendente.indirizzoNascita;
    this.data.dipendente.provinciaNascita = this.dipendente.provinciaNascita;
    this.data.dipendente.indirizzoResidenza = this.dipendente.indirizzoResidenza;
    this.data.dipendente.comuneResidenza = this.dipendente.comuneResidenza;
    this.data.dipendente.provinciaResidenza = this.dipendente.provinciaResidenza;
    this.data.dipendente.titoloStudio = this.dipendente.titoloStudio;
    this.data.dipendente.mansione = this.dipendente.mansione;
    this.data.dipendente.contratto = this.dipendente.contratto;
    this.data.dipendente.telefono = this.dipendente.telefono;
    this.data.dipendente.email = this.dipendente.email;

    if (
      this.dipendente.cognome == "" || this.dipendente.cognome == null || this.dipendente.cognome === undefined ||
      this.dipendente.nome == "" || this.dipendente.nome == null || this.dipendente.nome === undefined ||
      this.dipendente.cf == "" || this.dipendente.cf == null || this.dipendente.cf === undefined ||
      this.dipendente.sesso == "" || this.dipendente.sesso == null || this.dipendente.sesso === undefined
    ) {

      var campi = "";
      if (this.dipendente.cognome == "" || this.dipendente.cognome == null || this.dipendente.cognome === undefined) {
        campi = campi + " Cognome"
      }

      if (this.dipendente.nome == "" || this.dipendente.nome == null || this.dipendente.nome === undefined) {
        campi = campi + " Nome"
      }

      if (this.dipendente.cf == "" || this.dipendente.cf == null || this.dipendente.cf === undefined) {
        campi = campi + " Codice Fiscale"
      }

      if (this.dipendente.sesso == "" || this.dipendente.sesso == null || this.dipendente.sesso === undefined) {
        campi = campi + " Sesso"
      }

      this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
      return;
    } else {

      if (this.dateDiffInDays(new Date(this.data.dipendente.dataNascita), new Date()) < 10) {
        this.messageService.showMessageError("Data di nascita Errata!!!");
        return;
      }

      if (saveAndClose) {
        this.dialogRef.close(this.data.dipendente);
      }
      else {
        this.uploading = true;

        if (this.newItem) {
          this.dipendente.DataCreazione = new Date();
          this.dipendenteService
            .insert(this.data.dipendente)
            .then((x) => {

              console.log("Insert dipendente: ", x);
              this.data.dipendente = x;
              this.dipendente = x;
              this.uploading = false;
              this.newItem = false;


            })
            .catch((err) => {
              this.messageService.showMessageError(
                "Errore Inserimento dipendente (" + err["status"] + ")"
              );
              this.uploading = false;
            });
        }
        else {
          this.data.dipendente.DataUltimaModifica = new Date();
          this.dipendenteService
            .save(this.data.dipendente)
            .then((x) => {
              console.log("Save dipendente: ", x);
              this.uploading = false;
              this.newItem = false;
            })
            .catch((err) => {
              this.messageService.showMessageError(
                "Errore salvataggio dipendente (" + err["status"] + ")"
              );
              this.uploading = false;
            });
        }
      }
    }
  }

  ngOnInit() {
    this.loadUserCred();
    if (this.dipendente._id != undefined) {
      //this.getDocIdentita();
      //this.getDocMedicinaLav();
      //this.getContratti();
      //this.getDocsPrivacy();
      //this.getDiplomi();
      //this.getAttestatiECM();
      //this.getCedolini();
      //this.getCertificatoMalattia();

    }
  }

  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, this.dipendente)
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
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

  // DOCUMENTI IDENTITA
  async addDocIdentita() {
    this.addingDocIdentita = true;
    this.nuovoDocumentoIdentita = {
      filename: undefined,
      note: "",
      type: "DocumentoIdentita",
    };
  }

  async uploadDocIdentita($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoDocumentoIdentita.filename = file.name;
      this.nuovoDocumentoIdentita.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
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

        console.log(
          "doc identita cancellata this.fatture: ",
          this.docsIdentita
        );
        this.docIdentitaDataSource.data = this.docsIdentita;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveDocIdentita(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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

  async getDocIdentita() {
    // console.log(`get DocIdentita dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "DocumentoIdentita")
      .then((f: DocumentoDipendente[]) => {
        this.docsIdentita = f;

        console.log(`${this.dipendente._id} - Documenti trovati: ${this.docsIdentita.length}`);

        this.docIdentitaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.docsIdentita
        );
        this.docIdentitaDataSource.paginator = this.docIdentitaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }

  // FINE DOCUMENTI IDENTITA

  // RICHIESTE MATERIALI PRESIDI
  async getRichiesteMaterialiPresidi() {

  }

  async getFerie() {
    this.ferieService.getFerieByDipendente(this.dipendente._id).subscribe(
      (arr: Ferie[]) => this.ferie = arr
    )
  }

  async getPermessi() {
    this.permessiService.getPermessiByDipendente(this.dipendente._id).subscribe(
      (arr: Permessi[]) => this.permessi = arr
    )
  }

  async getCambioTurni() {
    this.cambiturniService.getCambiturnoByDipendente(this.dipendente._id).subscribe(
      (arr: Cambiturno[]) => this.cambioTurni = arr
    )
  }

  async getPresenze() {
    console.log(this.dipendente._id);
    this.presenzeService.getPresenzeByDipendente(this.dipendente._id).subscribe(
      (arr: Presenze[]) => this.presenze = arr
    )

  }



  // FINE RICHIESTE MATERIALI PRESIDI


  // CERTIFICATI MALATTIA
  async addCertificatoMalattia() {
    this.addingCertificatoMalattia = true;
    this.nuovoCertificatoMalattia = {
      filename: undefined,
      note: "",
      type: "CertificatoMalattia",
      filenameesito: "",
    };
  }

  async uploadCertificatoMalattia($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoCertificatoMalattia.filename = file.name;
      this.nuovoCertificatoMalattia.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
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

        console.log(
          "Certificato Malattia cancellata this.fatture: ",
          this.certificatiMalattia
        );
        this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveCertificatoMalattia(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento CertificatoMalattia");
        console.error(err);
      });
  }

  async showEsitoVMCF(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filenameesito, doc.type, this.dipendente)
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
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

  async getCertificatoMalattia() {
    console.log(`get CertificatoMalattia dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "CertificatoMalattia")
      .then((f: DocumentoDipendente[]) => {
        this.certificatiMalattia = f;

        this.certificatiMalattiaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.certificatiMalattia
        );
        this.certificatiMalattiaDataSource.paginator = this.certificatiMalattiaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista CERTIFICATI MALATTIA");
        console.error(err);
      });
  }

  uploadVMCF(doc: DocumentoDipendente) {
    const dialogDocCMCF = this.dialog.open(DialogCaricadocumentoComponent, {
      data: { dipendente: this.dipendente, doc: doc },
    });

    dialogDocCMCF.afterClosed().subscribe((result) => {
      console.log("result upload VMCF", result);
      if (result !== false) {
        this.docService
          .update(result)
          .then((x) => {
            const index = this.certificatiMalattia.indexOf(doc);

            this.certificatiMalattia[index] = doc;

            this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
            //dialogDocCMCF.close(result);
          })
          .catch((err) => {
            if (err["status"] != undefined && err["status"] != 500)
              this.messageService.showMessageError(
                "Errore upload VMCF (" + err["status"] + ")"
              );
          });
      }
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

        this.docsMedicinaDataSource = new MatTableDataSource<DocumentoMedicinaLavoro>(
          this.docsMedicina
        );
        this.docsMedicinaDataSource.paginator = this.docsMedicinaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista DocMedicinaLav");
        console.error(err);
      });
  }

  async showDocumentRichiesta(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocMedicinaLavoro(
        doc.filenameRichiesta,
        "MedicinaLavoroRichiesta",
        this.dipendente
      )
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
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

  async showDocumentCertificato(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocDipendente(
        doc.filenameCertificato,
        "MedicinaLavoroCertificato",
        this.dipendente
      )
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
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

  uploadMedicinaCertificato(doc: DocumentoMedicinaLavoro) {

    const dialogDocCMCF = this.dialog.open(DialogCaricadocumentoMedicinaComponent, {
      data: { dipendente: this.dipendente, doc: doc },
    });

    dialogDocCMCF.afterClosed().subscribe((result) => {
      console.log("result upload VMCF", result);
      if (result !== false) {
        this.docService
          .updateMed(result)
          .then((x) => {
            const index = this.docsMedicina.indexOf(doc);

            this.docsMedicina[index] = x;

            this.docsMedicinaDataSource.data = this.docsMedicina;
            //dialogDocCMCF.close(result);
          })
          .catch((err) => {
            if (err["status"] != undefined && err["status"] != 500)
              this.messageService.showMessageError(
                "Errore upload VMCF (" + err["status"] + ")"
              );
          });
      }
    });

  }

  async saveMedicinaRichiesta(doc: DocumentoMedicinaLavoro) {
    if (!doc.fileRichiesta) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "MedicinaLavoroRichiesta";
    const path = "MedicinaLavoroRichiesta";
    const file: File = doc.fileRichiesta;
    this.uploadingMedicina = true;

    console.log("Invio Contratto: ", doc);
    this.docService
      .insertDocMed(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Contratto: ", result);
        this.docsMedicina.push(result);
        this.docsMedicinaDataSource.data = this.docsMedicina;
        this.addingMedicina = false;
        this.uploadingMedicina = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filenameRichiesta;

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


  async addMedicinaRichiesta() {
    this.addingMedicina = true;
    this.nuovoMedicina = {
      filenameRichiesta: undefined,
      noteRichiesta: ""
    };
  }


  async uploadMedicinaRichiesta($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoMedicina.filenameRichiesta = file.name;
      this.nuovoMedicina.fileRichiesta = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }


  // FINE DOCUMENTI IDENTITA

  // CONTRATTI
  async addContratto() {
    this.addingContratto = true;
    this.nuovoContratto = {
      filename: undefined,
      note: "",
      type: "Contratto",
    };
  }


  async uploadContratto($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoContratto.filename = file.name;
      this.nuovoContratto.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
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
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveContratto(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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

  async getContratti() {
    console.log(`get Contratto dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Contratto")
      .then((f: DocumentoDipendente[]) => {
        this.contratti = f;

        this.contrattiDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.contratti
        );
        this.contrattiDataSource.paginator = this.contrattoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Contratto");
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
      type: "Privacy",
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
      this.messageService.showMessageError("File non valido");
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
        this.messageService.showMessageError("Errore nella cancellazione Privacy");
        console.error(err);
      });
  }

  async savePrivacy(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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

  async getDocsPrivacy() {
    console.log(`get Privacy dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Privacy")
      .then((f: DocumentoDipendente[]) => {
        this.docsprivacy = f;

        this.docsprivacyDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.docsprivacy
        );
        this.docsprivacyDataSource.paginator = this.contrattoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Privacy");
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
      type: "Diploma",
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
      this.messageService.showMessageError("File non valido");
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
        this.messageService.showMessageError("Errore nella cancellazione Diploma");
        console.error(err);
      });
  }

  async saveDiploma(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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

  async getDiplomi() {
    console.log(`get Diplomi dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Diploma")
      .then((f: DocumentoDipendente[]) => {
        this.diplomi = f;

        this.diplomiDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.diplomi
        );
        this.diplomiDataSource.paginator = this.diplomaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Diplomi");
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
      type: "AttestatoECM",
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
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async Close() {
    //window.location.reload();
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
        this.messageService.showMessageError("Errore nella cancellazione AttestatoECM");
        console.error(err);
      });
  }

  async saveAttestatoECM(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
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
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento Documento");
        console.error(err);
      });
  }

  async getAttestatiECM() {
    console.log(`get AttestatiECM dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Diploma")
      .then((f: DocumentoDipendente[]) => {
        this.attestati = f;

        this.attestatiECMDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.attestati
        );
        this.attestatiECMDataSource.paginator = this.attestatiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista attestatiECM");
        console.error(err);
      });
  }

  // FINE ATTESTATI ECM

  // CEDOLINI

  async addCedolino() {
    this.addingCedolino = true;
    this.nuovoCedolino = {
      filename: undefined,
      note: "",
      type: "Cedolino",
    };
  }

  async uploadCedolino($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Cedolino: ", $event);
      this.nuovoCedolino.filename = file.name;
      this.nuovoCedolino.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteCedolino(doc: DocumentoDipendente) {
    console.log("Cancella Cedolino: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("cedolino cancellato");
        const index = this.cedolini.indexOf(doc);
        console.log("cedolino cancellato index: ", index);
        if (index > -1) {
          this.cedolini.splice(index, 1);
        }

        console.log("cedolino cancellato : ", doc);
        this.cedoliniDataSource.data = this.cedolini;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Cedolino");
        console.error(err);
      });
  }

  async saveCedolino(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Cedolino";
    const path = "Cedolino";
    const file: File = doc.file;
    this.uploadingCedolino = true;

    console.log("Invio Cedolino: ", doc);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Cedolino: ", result);
        this.cedolini.push(result);
        this.cedoliniDataSource.data = this.cedolini;
        this.addingCedolino = false;
        this.uploadingCedolino = false;

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


  async getCedolini() {
    console.log(`get Cedolini dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Cedolino")
      .then((f: DocumentoDipendente[]) => {
        this.cedolini = f;

        this.cedoliniDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.cedolini
        );
        this.cedoliniDataSource.paginator = this.cedoliniPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista cedolini");
        console.error(err);
      });
  }

  // FINE CEDOLINI
}
