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
  selector: 'app-rls',
  templateUrl: './rls.component.html',
  styleUrls: ['./rls.component.css']
})
export class RLSComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorrls", { static: false })
  rlsPaginator: MatPaginator;
  public nuovorls: DocumentoDipendente;
  public rlsDataSource: MatTableDataSource<DocumentoDipendente>;
  public rls: DocumentoDipendente[];
  public uploadingrls: boolean;
  public addingrls: boolean;
  public inputSearchField1: String;
  public inputSearchField2: String;

  @ViewChild("paginatorarchivioCorsiDiAggiornamento", { static: false })
  archivioCorsiDiAggiornamentoPaginator: MatPaginator;
  public archivioCorsiDiAggiornamentoDataSource: MatTableDataSource<DocumentoDipendente>;
  public archivioCorsiDiAggiornamento: DocumentoDipendente[];
  public uploadingarchivioCorsiDiAggiornamento: boolean;
  public addingarchivioCorsiDiAggiornamento: boolean;
  public nuovaarchivioCorsiDiAggiornamento: DocumentoDipendente;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingrls = false;
    this.addingrls = false;
    this.nuovorls = new DocumentoDipendente();
    this.rls = [];
    this.rlsDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.archivioCorsiDiAggiornamento = [];
    this.archivioCorsiDiAggiornamentoDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingarchivioCorsiDiAggiornamento = false;
    this.addingarchivioCorsiDiAggiornamento = false;
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
            this.getrls();
            this.getarchivioCorsiDiAggiornamento();
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



  // rls
  async addrls() {
    this.addingrls = true;
    this.nuovorls = {
      filename: undefined,
      note: "",
      type: "rls",
    };
  }

  async uploadrls($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload rls: ", $event);
      this.nuovorls.filename = file.name;
      this.nuovorls.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleterls(doc: DocumentoDipendente) {
    console.log("Cancella rls: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("rls cancellata");
        const index = this.rls.indexOf(doc);
        console.log("rls cancellata index: ", index);
        if (index > -1) {
          this.rls.splice(index, 1);
        }

        console.log("rls cancellata this.fatture: ", this.rls);
        this.rlsDataSource.data = this.rls;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saverls(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "rls";
    const path = "rls";
    const file: File = doc.file;
    this.uploadingrls = true;

    console.log("Invio rls: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert rls: ", result);
        this.rls.push(result);
        this.rlsDataSource.data = this.rls;
        this.addingrls = false;
        this.uploadingrls = false;

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
        this.messageService.showMessageError("Errore Inserimento rls");
        console.error(err);
      });
  }

  async getrls() {
    console.log(`get rls dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("rls")
      .then((f: DocumentoDipendente[]) => {
        this.rls = f;

        this.rlsDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.rls
        );
        this.rlsDataSource.paginator = this.rlsPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista rls");
        console.error(err);
      });
  }

  // FINE rls


  // archivioCorsiDiAggiornamento

  async getarchivioCorsiDiAggiornamento() {
    console.log(`get archivioCorsiDiAggiornamento dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("archivioCorsiDiAggiornamento")
      .then((f: DocumentoDipendente[]) => {
        this.archivioCorsiDiAggiornamento = f;

        this.archivioCorsiDiAggiornamentoDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.archivioCorsiDiAggiornamento
        );
        this.archivioCorsiDiAggiornamentoDataSource.paginator = this.archivioCorsiDiAggiornamentoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista archivioCorsiDiAggiornamento");
        console.error(err);
      });
  }

  async addarchivioCorsiDiAggiornamento() {
    this.addingarchivioCorsiDiAggiornamento = true;
    this.nuovaarchivioCorsiDiAggiornamento = {
      filename: undefined,
      note: "",
      type: "archivioCorsiDiAggiornamento",
    };
  }

  async uploadarchivioCorsiDiAggiornamento($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload archivioCorsiDiAggiornamento: ", $event);
      this.nuovaarchivioCorsiDiAggiornamento.filename = file.name;
      this.nuovaarchivioCorsiDiAggiornamento.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletearchivioCorsiDiAggiornamento(doc: DocumentoDipendente) {
    console.log("Cancella archivioCorsiDiAggiornamento: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("archivioCorsiDiAggiornamento cancellata");
        const index = this.archivioCorsiDiAggiornamento.indexOf(doc);
        console.log("archivioCorsiDiAggiornamento cancellata index: ", index);
        if (index > -1) {
          this.archivioCorsiDiAggiornamento.splice(index, 1);
        }

        console.log("archivioCorsiDiAggiornamento cancellata this.fatture: ", this.archivioCorsiDiAggiornamento);
        this.archivioCorsiDiAggiornamentoDataSource.data = this.archivioCorsiDiAggiornamento;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione archivioCorsiDiAggiornamento");
        console.error(err);
      });
  }

  async savearchivioCorsiDiAggiornamento(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "archivioCorsiDiAggiornamento";
    const path = "archivioCorsiDiAggiornamento";
    const file: File = doc.file;
    this.uploadingarchivioCorsiDiAggiornamento = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert archivioCorsiDiAggiornamento: ", result);
        this.archivioCorsiDiAggiornamento.push(result);
        this.archivioCorsiDiAggiornamentoDataSource.data = this.archivioCorsiDiAggiornamento;
        this.addingarchivioCorsiDiAggiornamento = false;
        this.uploadingarchivioCorsiDiAggiornamento = false;

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
        this.messageService.showMessageError("Errore Inserimento archivioCorsiDiAggiornamento");
        console.error(err);
      });
  }


  // FINE archivioCorsiDiAggiornamento


  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "rls") this.rlsDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "archivioCorsiDiAggiornamento") this.archivioCorsiDiAggiornamentoDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "rls") {
      this.rlsDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "archivioCorsiDiAggiornamento") {
      this.archivioCorsiDiAggiornamentoDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }

  }
}
