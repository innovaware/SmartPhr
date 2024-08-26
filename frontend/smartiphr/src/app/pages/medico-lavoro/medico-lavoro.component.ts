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
  selector: 'app-medico-lavoro',
  templateUrl: './medico-lavoro.component.html',
  styleUrls: ['./medico-lavoro.component.css']
})
export class MedicoLavoroComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatormedicoLavoro", { static: false })
  medicoLavoroPaginator: MatPaginator;
  public nuovomedicoLavoro: DocumentoDipendente;
  public medicoLavoroDataSource: MatTableDataSource<DocumentoDipendente>;
  public medicoLavoro: DocumentoDipendente[];
  public uploadingmedicoLavoro: boolean;
  public addingmedicoLavoro: boolean;
  public inputSearchField1: String;
  public inputSearchField2: String;

  @ViewChild("paginatorarchivioVerbali", { static: false })
  archivioVerbaliPaginator: MatPaginator;
  public archivioVerbaliDataSource: MatTableDataSource<DocumentoDipendente>;
  public archivioVerbali: DocumentoDipendente[];
  public uploadingarchivioVerbali: boolean;
  public addingarchivioVerbali: boolean;
  public nuovaarchivioVerbali: DocumentoDipendente;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingmedicoLavoro = false;
    this.addingmedicoLavoro = false;
    this.nuovomedicoLavoro = new DocumentoDipendente();
    this.medicoLavoro = [];
    this.medicoLavoroDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.archivioVerbali = [];
    this.archivioVerbaliDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingarchivioVerbali = false;
    this.addingarchivioVerbali = false;
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
            this.getmedicoLavoro(); 
            this.getarchivioVerbali();
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



  // medicoLavoro
  async addmedicoLavoro() {
    this.addingmedicoLavoro = true;
    this.nuovomedicoLavoro = {
      filename: undefined,
      note: "",
      type: "medicoLavoro",
    };
  }

  async uploadmedicoLavoro($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload medicoLavoro: ", $event);
      this.nuovomedicoLavoro.filename = file.name;
      this.nuovomedicoLavoro.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletemedicoLavoro(doc: DocumentoDipendente) {
    console.log("Cancella medicoLavoro: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("medicoLavoro cancellata");
        const index = this.medicoLavoro.indexOf(doc);
        console.log("medicoLavoro cancellata index: ", index);
        if (index > -1) {
          this.medicoLavoro.splice(index, 1);
        }

        console.log("medicoLavoro cancellata this.fatture: ", this.medicoLavoro);
        this.medicoLavoroDataSource.data = this.medicoLavoro;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async savemedicoLavoro(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "medicoLavoro";
    const path = "medicoLavoro";
    const file: File = doc.file;
    this.uploadingmedicoLavoro = true;

    console.log("Invio medicoLavoro: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert medicoLavoro: ", result);
        this.medicoLavoro.push(result);
        this.medicoLavoroDataSource.data = this.medicoLavoro;
        this.addingmedicoLavoro = false;
        this.uploadingmedicoLavoro = false;

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
        this.messageService.showMessageError("Errore Inserimento medicoLavoro");
        console.error(err);
      });
  }

  async getmedicoLavoro() {
    console.log(`get medicoLavoro dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("medicoLavoro")
      .then((f: DocumentoDipendente[]) => {
        this.medicoLavoro = f;

        this.medicoLavoroDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.medicoLavoro
        );
        this.medicoLavoroDataSource.paginator = this.medicoLavoroPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista medicoLavoro");
        console.error(err);
      });
  }

  // FINE medicoLavoro


  // archivioVerbali

  async getarchivioVerbali() {
    console.log(`get archivioVerbali dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("archivioVerbali")
      .then((f: DocumentoDipendente[]) => {
        this.archivioVerbali = f;

        this.archivioVerbaliDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.archivioVerbali
        );
        this.archivioVerbaliDataSource.paginator = this.archivioVerbaliPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista archivioVerbali");
        console.error(err);
      });
  }

  async addarchivioVerbali() {
    this.addingarchivioVerbali = true;
    this.nuovaarchivioVerbali = {
      filename: undefined,
      note: "",
      type: "archivioVerbali",
    };
  }

  async uploadarchivioVerbali($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload archivioVerbali: ", $event);
      this.nuovaarchivioVerbali.filename = file.name;
      this.nuovaarchivioVerbali.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletearchivioVerbali(doc: DocumentoDipendente) {
    console.log("Cancella archivioVerbali: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("archivioVerbali cancellata");
        const index = this.archivioVerbali.indexOf(doc);
        console.log("archivioVerbali cancellata index: ", index);
        if (index > -1) {
          this.archivioVerbali.splice(index, 1);
        }

        console.log("archivioVerbali cancellata this.fatture: ", this.archivioVerbali);
        this.archivioVerbaliDataSource.data = this.archivioVerbali;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione archivioVerbali");
        console.error(err);
      });
  }

  async savearchivioVerbali(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "archivioVerbali";
    const path = "archivioVerbali";
    const file: File = doc.file;
    this.uploadingarchivioVerbali = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert archivioVerbali: ", result);
        this.archivioVerbali.push(result);
        this.archivioVerbaliDataSource.data = this.archivioVerbali;
        this.addingarchivioVerbali = false;
        this.uploadingarchivioVerbali = false;

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
        this.messageService.showMessageError("Errore Inserimento archivioVerbali");
        console.error(err);
      });
  }


  // FINE archivioVerbali


  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "medicoLavoro") this.medicoLavoroDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "archivioVerbali") this.archivioVerbaliDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "medicoLavoro") {
      this.medicoLavoroDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "archivioVerbali") {
      this.archivioVerbaliDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }

  }
}
