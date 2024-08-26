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
  selector: 'app-rspp',
  templateUrl: './rspp.component.html',
  styleUrls: ['./rspp.component.css']
})
export class RSPPComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorrspp", { static: false })
  rsppPaginator: MatPaginator;
  public nuovorspp: DocumentoDipendente;
  public rsppDataSource: MatTableDataSource<DocumentoDipendente>;
  public rspp: DocumentoDipendente[];
  public uploadingrspp: boolean;
  public addingrspp: boolean;
  public inputSearchField1: String;
  public inputSearchField2: String;

  @ViewChild("paginatorarchivioAggiornamentoFormativo", { static: false })
  archivioAggiornamentoFormativoPaginator: MatPaginator;
  public archivioAggiornamentoFormativoDataSource: MatTableDataSource<DocumentoDipendente>;
  public archivioAggiornamentoFormativo: DocumentoDipendente[];
  public uploadingarchivioAggiornamentoFormativo: boolean;
  public addingarchivioAggiornamentoFormativo: boolean;
  public nuovaarchivioAggiornamentoFormativo: DocumentoDipendente;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingrspp = false;
    this.addingrspp = false;
    this.nuovorspp = new DocumentoDipendente();
    this.rspp = [];
    this.rsppDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.archivioAggiornamentoFormativo = [];
    this.archivioAggiornamentoFormativoDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingarchivioAggiornamentoFormativo = false;
    this.addingarchivioAggiornamentoFormativo = false;
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
            this.getrspp();
            this.getarchivioAggiornamentoFormativo();
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



  // rspp
  async addrspp() {
    this.addingrspp = true;
    this.nuovorspp = {
      filename: undefined,
      note: "",
      type: "rspp",
    };
  }

  async uploadrspp($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload rspp: ", $event);
      this.nuovorspp.filename = file.name;
      this.nuovorspp.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleterspp(doc: DocumentoDipendente) {
    console.log("Cancella rspp: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("rspp cancellata");
        const index = this.rspp.indexOf(doc);
        console.log("rspp cancellata index: ", index);
        if (index > -1) {
          this.rspp.splice(index, 1);
        }

        console.log("rspp cancellata this.fatture: ", this.rspp);
        this.rsppDataSource.data = this.rspp;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saverspp(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "rspp";
    const path = "rspp";
    const file: File = doc.file;
    this.uploadingrspp = true;

    console.log("Invio rspp: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert rspp: ", result);
        this.rspp.push(result);
        this.rsppDataSource.data = this.rspp;
        this.addingrspp = false;
        this.uploadingrspp = false;

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
        this.messageService.showMessageError("Errore Inserimento rspp");
        console.error(err);
      });
  }

  async getrspp() {
    console.log(`get rspp dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("rspp")
      .then((f: DocumentoDipendente[]) => {
        this.rspp = f;

        this.rsppDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.rspp
        );
        this.rsppDataSource.paginator = this.rsppPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista rspp");
        console.error(err);
      });
  }

  // FINE rspp


  // archivioAggiornamentoFormativo

  async getarchivioAggiornamentoFormativo() {
    console.log(`get archivioAggiornamentoFormativo dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("archivioAggiornamentoFormativo")
      .then((f: DocumentoDipendente[]) => {
        this.archivioAggiornamentoFormativo = f;

        this.archivioAggiornamentoFormativoDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.archivioAggiornamentoFormativo
        );
        this.archivioAggiornamentoFormativoDataSource.paginator = this.archivioAggiornamentoFormativoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista archivioAggiornamentoFormativo");
        console.error(err);
      });
  }

  async addarchivioAggiornamentoFormativo() {
    this.addingarchivioAggiornamentoFormativo = true;
    this.nuovaarchivioAggiornamentoFormativo = {
      filename: undefined,
      note: "",
      type: "archivioAggiornamentoFormativo",
    };
  }

  async uploadarchivioAggiornamentoFormativo($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload archivioAggiornamentoFormativo: ", $event);
      this.nuovaarchivioAggiornamentoFormativo.filename = file.name;
      this.nuovaarchivioAggiornamentoFormativo.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletearchivioAggiornamentoFormativo(doc: DocumentoDipendente) {
    console.log("Cancella archivioAggiornamentoFormativo: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("archivioAggiornamentoFormativo cancellata");
        const index = this.archivioAggiornamentoFormativo.indexOf(doc);
        console.log("archivioAggiornamentoFormativo cancellata index: ", index);
        if (index > -1) {
          this.archivioAggiornamentoFormativo.splice(index, 1);
        }

        console.log("archivioAggiornamentoFormativo cancellata this.fatture: ", this.archivioAggiornamentoFormativo);
        this.archivioAggiornamentoFormativoDataSource.data = this.archivioAggiornamentoFormativo;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione archivioAggiornamentoFormativo");
        console.error(err);
      });
  }

  async savearchivioAggiornamentoFormativo(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "archivioAggiornamentoFormativo";
    const path = "archivioAggiornamentoFormativo";
    const file: File = doc.file;
    this.uploadingarchivioAggiornamentoFormativo = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert archivioAggiornamentoFormativo: ", result);
        this.archivioAggiornamentoFormativo.push(result);
        this.archivioAggiornamentoFormativoDataSource.data = this.archivioAggiornamentoFormativo;
        this.addingarchivioAggiornamentoFormativo = false;
        this.uploadingarchivioAggiornamentoFormativo = false;

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
        this.messageService.showMessageError("Errore Inserimento archivioAggiornamentoFormativo");
        console.error(err);
      });
  }


  // FINE archivioAggiornamentoFormativo


  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "rspp") this.rsppDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "archivioAggiornamentoFormativo") this.archivioAggiornamentoFormativoDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "rspp") {
      this.rsppDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "archivioAggiornamentoFormativo") {
      this.archivioAggiornamentoFormativoDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }

  }
}
