import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoDipendente } from 'src/app/models/documentoDipendente';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';
import { MansioniService } from '../../service/mansioni.service';

@Component({
  selector: 'app-areaqualita-generale',
  templateUrl: './areaqualita-generale.component.html',
  styleUrls: ['./areaqualita-generale.component.css']
})
export class QualitaGeneraleComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorManuali", { static: false })
  ManualePaginator: MatPaginator;
  public nuovoManuale: DocumentoDipendente;
  public manualiDataSource: MatTableDataSource<DocumentoDipendente>;
  public manuali: DocumentoDipendente[];
  public uploadingManuale: boolean;
  public addingManuale: boolean;
  public inputSearchField1: String;
  public inputSearchField2: String;
  public inputSearchField3: String;

  @ViewChild("paginatorprocedure", { static: false })
  procedurePaginator: MatPaginator;
  public procedureDataSource: MatTableDataSource<DocumentoDipendente>;
  public procedure: DocumentoDipendente[];
  public uploadingProcedure: boolean;
  public addingProcedure: boolean;
  public nuovaProcedura: DocumentoDipendente;


  @ViewChild("paginatoristruzioni", { static: false })
  istruzioniPaginator: MatPaginator;
  public istruzioniDataSource: MatTableDataSource<DocumentoDipendente>;
  public istruzioni: DocumentoDipendente[];
  public uploadingistruzioni: boolean;
  public addingistruzioni: boolean;
  public nuovaIstruzione: DocumentoDipendente;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingManuale = false;
    this.addingManuale = false;
    this.nuovoManuale = new DocumentoDipendente();
    this.manuali = [];
    this.manualiDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.procedure = [];
    this.procedureDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingProcedure = false;
    this.addingProcedure = false;
    this.istruzioni = [];
    this.istruzioniDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingistruzioni = false;
    this.addingistruzioni = false;
  }

  ngOnInit() {
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            
            this.dipendente = x[0];
            this.mansioniService.getById(this.dipendente.mansione).then((result) => {
              if (result.codice == "AU" || result.codice == "DA" || result.codice == "RA" || result.codice == "SA") {
                this.admin = true;
              }
            });
            this.getManuali();
            this.getProcedure();
            this.getIstruzioni();
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }

  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocQuality(doc.filename, doc.type)
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



  // manuali
  async addManuale() {
    this.addingManuale = true;
    this.nuovoManuale = {
      filename: undefined,
      note: "",
      type: "Manuale",
    };
  }

  async uploadManuale($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Manuale: ", $event);
      this.nuovoManuale.filename = file.name;
      this.nuovoManuale.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteManuale(doc: DocumentoDipendente) {
    console.log("Cancella Manuale: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Manuale cancellata");
        const index = this.manuali.indexOf(doc);
        console.log("Manuale cancellata index: ", index);
        if (index > -1) {
          this.manuali.splice(index, 1);
        }

        console.log("Manuale cancellata this.fatture: ", this.manuali);
        this.manualiDataSource.data = this.manuali;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveManuale(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Manuale";
    const path = "Manuale";
    const file: File = doc.file;
    this.uploadingManuale = true;

    console.log("Invio Manuale: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Manuale: ", result);
        this.manuali.push(result);
        this.manualiDataSource.data = this.manuali;
        this.addingManuale = false;
        this.uploadingManuale = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
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
        this.messageService.showMessageError("Errore Inserimento Manuale");
        console.error(err);
      });
  }

  async getManuali() {
    console.log(`get Manuale dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("Manuale")
      .then((f: DocumentoDipendente[]) => {
        this.manuali = f;

        this.manualiDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.manuali
        );
        this.manualiDataSource.paginator = this.ManualePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Manuale");
        console.error(err);
      });
  }

  // FINE manuali


  // procedure

  async getProcedure() {
    console.log(`get procedure dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("Procedure")
      .then((f: DocumentoDipendente[]) => {
        this.procedure = f;

        this.procedureDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.procedure
        );
        this.procedureDataSource.paginator = this.procedurePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista procedure");
        console.error(err);
      });
  }

  async addProcedure() {
    this.addingProcedure = true;
    this.nuovaProcedura = {
      filename: undefined,
      note: "",
      type: "Procedure",
    };
  }

  async uploadProcedure($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Procedure: ", $event);
      this.nuovaProcedura.filename = file.name;
      this.nuovaProcedura.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteProcedure(doc: DocumentoDipendente) {
    console.log("Cancella Procedura: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Procedura cancellata");
        const index = this.procedure.indexOf(doc);
        console.log("Procedura cancellata index: ", index);
        if (index > -1) {
          this.procedure.splice(index, 1);
        }

        console.log("Procedura cancellata this.fatture: ", this.procedure);
        this.procedureDataSource.data = this.procedure;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Procedura");
        console.error(err);
      });
  }

  async saveProcedura(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Procedure";
    const path = "Procedure";
    const file: File = doc.file;
    this.uploadingProcedure = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Procedura: ", result);
        this.procedure.push(result);
        this.procedureDataSource.data = this.procedure;
        this.addingProcedure = false;
        this.uploadingProcedure = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
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
        this.messageService.showMessageError("Errore Inserimento Procedura");
        console.error(err);
      });
  }


  // FINE procedure


  // Istruzioni

  async getIstruzioni() {
    console.log(`get Istruzioni dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("Istruzioni")
      .then((f: DocumentoDipendente[]) => {
        this.istruzioni = f;

        this.istruzioniDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.istruzioni
        );
        this.istruzioniDataSource.paginator = this.istruzioniPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista istruzioni");
        console.error(err);
      });
  }

  async addIstruzioni() {
    this.addingistruzioni = true;
    this.nuovaIstruzione = {
      filename: undefined,
      note: "",
      type: "Istruzioni",
    };
  }

  async uploadIstruzioni($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Iscrizione: ", $event);
      this.nuovaIstruzione.filename = file.name;
      this.nuovaIstruzione.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteIstruzioni(doc: DocumentoDipendente) {
    console.log("Cancella Procedura: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Procedura cancellata");
        const index = this.manuali.indexOf(doc);
        console.log("Procedura cancellata index: ", index);
        if (index > -1) {
          this.istruzioni.splice(index, 1);
        }

        console.log("Procedura cancellata this.fatture: ", this.istruzioni);
        this.istruzioniDataSource.data = this.istruzioni;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Iscrizione");
        console.error(err);
      });
  }

  async saveIstruzione(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Istruzioni";
    const path = "Istruzioni";
    const file: File = doc.file;
    this.uploadingProcedure = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Procedura: ", result);
        this.istruzioni.push(result);
        this.istruzioniDataSource.data = this.istruzioni;
        this.addingistruzioni = false;
        this.uploadingistruzioni = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
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
        this.messageService.showMessageError("Errore Inserimento Procedura");
        console.error(err);
      });
  }


  // FINE Istruzioni

  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "Manuali") this.manualiDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "Procedure") this.procedureDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "Istruzioni") this.istruzioniDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "Manuali") {
      this.manualiDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "Procedure") {
      this.procedureDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }
    if (type == "Istruzioni") {
      this.istruzioniDataSource.filter = undefined;
      this.inputSearchField3 = undefined;
    }

  }

}
