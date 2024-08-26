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
  selector: 'app-visita-pre-assunzioni',
  templateUrl: './visita-pre-assunzioni.component.html',
  styleUrls: ['./visita-pre-assunzioni.component.css']
})
export class VisitePreAssunzioniComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatoresamilab", { static: false })
  esamilabPaginator: MatPaginator;
  public nuovoesamilab: DocumentoDipendente;
  public esamilabDataSource: MatTableDataSource<DocumentoDipendente>;
  public esamilab: DocumentoDipendente[];
  public uploadingesamilab: boolean;
  public addingesamilab: boolean;
  public inputSearchField1: String;
  public inputSearchField2: String;
  public inputSearchField3: String;

  @ViewChild("paginatorcertificatoIdoneita", { static: false })
  certificatoIdoneitaPaginator: MatPaginator;
  public certificatoIdoneitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public certificatoIdoneita: DocumentoDipendente[];
  public uploadingcertificatoIdoneita: boolean;
  public addingcertificatoIdoneita: boolean;
  public nuovaCertificatoIdoneita: DocumentoDipendente;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingesamilab = false;
    this.addingesamilab = false;
    this.nuovoesamilab = new DocumentoDipendente();
    this.esamilab = [];
    this.esamilabDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.certificatoIdoneita = [];
    this.certificatoIdoneitaDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.uploadingcertificatoIdoneita = false;
    this.addingcertificatoIdoneita = false;
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
            this.getesamilab();
            this.getcertificatoIdoneita();
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }

  async showDocument(doc: DocumentoDipendente) {
    console.log(doc);
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



  // esamilab
  async addesamilab() {
    this.addingesamilab = true;
    this.nuovoesamilab = {
      filename: undefined,
      note: "",
      type: "EsamiLaboratorio",
    };
  }

  async uploadesamilab($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload esamilab: ", $event);
      this.nuovoesamilab.filename = file.name;
      this.nuovoesamilab.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteesamilab(doc: DocumentoDipendente) {
    console.log("Cancella esamilab: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("esamilab cancellata");
        const index = this.esamilab.indexOf(doc);
        console.log("esamilab cancellata index: ", index);
        if (index > -1) {
          this.esamilab.splice(index, 1);
        }

        console.log("esamilab cancellata this.fatture: ", this.esamilab);
        this.esamilabDataSource.data = this.esamilab;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveesamilab(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "EsamiLaboratorio";
    const path = "EsamiLaboratorio";
    const file: File = doc.file;
    this.uploadingesamilab = true;

    console.log("Invio esamilab: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert EsamiLaboratorio: ", result);
        this.esamilab.push(result);
        this.esamilabDataSource.data = this.esamilab;
        this.addingesamilab = false;
        this.uploadingesamilab = false;

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
        this.messageService.showMessageError("Errore Inserimento esamilab");
        console.error(err);
      });
  }

  async getesamilab() {
    console.log(`get esamilab dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("EsamiLaboratorio")
      .then((f: DocumentoDipendente[]) => {
        this.esamilab = f;

        this.esamilabDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.esamilab
        );
        this.esamilabDataSource.paginator = this.esamilabPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista esamilab");
        console.error(err);
      });
  }

  // FINE esamilab


  // certificatoIdoneita

  async getcertificatoIdoneita() {
    console.log(`get certificatoIdoneita dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("certificatoIdoneitaPrimaVisita")
      .then((f: DocumentoDipendente[]) => {
        this.certificatoIdoneita = f;

        this.certificatoIdoneitaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.certificatoIdoneita
        );
        this.certificatoIdoneitaDataSource.paginator = this.certificatoIdoneitaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista certificatoIdoneita");
        console.error(err);
      });
  }

  async addcertificatoIdoneita() {
    this.addingcertificatoIdoneita = true;
    this.nuovaCertificatoIdoneita = {
      filename: undefined,
      note: "",
      type: "certificatoIdoneitaPrimaVisita",
    };
  }

  async uploadcertificatoIdoneita($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload certificatoIdoneita: ", $event);
      this.nuovaCertificatoIdoneita.filename = file.name;
      this.nuovaCertificatoIdoneita.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletecertificatoIdoneita(doc: DocumentoDipendente) {
    console.log("Cancella certificatoIdoneita: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("certificatoIdoneita cancellata");
        const index = this.certificatoIdoneita.indexOf(doc);
        console.log("certificatoIdoneita cancellata index: ", index);
        if (index > -1) {
          this.certificatoIdoneita.splice(index, 1);
        }

        console.log("certificatoIdoneita cancellata this.fatture: ", this.certificatoIdoneita);
        this.certificatoIdoneitaDataSource.data = this.certificatoIdoneita;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione certificatoIdoneita");
        console.error(err);
      });
  }

  async saveCertificatoIdoneita(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "certificatoIdoneitaPrimaVisita";
    const path = "certificatoIdoneitaPrimaVisita";
    const file: File = doc.file;
    this.uploadingcertificatoIdoneita = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert certificatoIdoneita: ", result);
        this.certificatoIdoneita.push(result);
        this.certificatoIdoneitaDataSource.data = this.certificatoIdoneita;
        this.addingcertificatoIdoneita = false;
        this.uploadingcertificatoIdoneita = false;

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
        this.messageService.showMessageError("Errore Inserimento certificatoIdoneita");
        console.error(err);
      });
  }


  // FINE certificatoIdoneita


  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "esamilab") this.esamilabDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "certificatoIdoneita") this.certificatoIdoneitaDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "esamilab") {
      this.esamilabDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "certificatoIdoneita") {
      this.certificatoIdoneitaDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }

  }
}
