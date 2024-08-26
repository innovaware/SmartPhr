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
  selector: 'app-audit-interno',
  templateUrl: './audit-interno.component.html',
  styleUrls: ['./audit-interno.component.css']
})
export class AuditInternoComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorAuditInterno", { static: false })
  AuditInternoPaginator: MatPaginator;
  public nuovoAuditInterno: DocumentoDipendente;
  public AuditInternoDataSource: MatTableDataSource<DocumentoDipendente>;
  public AuditInterno: DocumentoDipendente[];
  public uploadingAuditInterno: boolean;
  public addingAuditInterno: boolean;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingAuditInterno = false;
    this.addingAuditInterno = false;
    this.nuovoAuditInterno = new DocumentoDipendente();
    this.AuditInterno = [];
    this.AuditInternoDataSource = new MatTableDataSource<DocumentoDipendente>();
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
            this.getNomina();
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



  // AuditInterno
  async addAuditInterno() {
    this.addingAuditInterno = true;
    this.nuovoAuditInterno = {
      filename: undefined,
      note: "",
      type: "AuditInterno",
    };
  }

  async uploadAuditInterno($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload AuditInterno: ", $event);
      this.nuovoAuditInterno.filename = file.name;
      this.nuovoAuditInterno.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteAuditInterno(doc: DocumentoDipendente) {
    console.log("Cancella AuditInterno: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("AuditInterno cancellata");
        const index = this.AuditInterno.indexOf(doc);
        console.log("AuditInterno cancellata index: ", index);
        if (index > -1) {
          this.AuditInterno.splice(index, 1);
        }

        console.log("AuditInterno cancellata this.fatture: ", this.AuditInterno);
        this.AuditInternoDataSource.data = this.AuditInterno;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveAuditInterno(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "AuditInterno";
    const path = "AuditInterno";
    const file: File = doc.file;
    this.uploadingAuditInterno = true;

    console.log("Invio AuditInterno: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert AuditInterno: ", result);
        this.AuditInterno.push(result);
        this.AuditInternoDataSource.data = this.AuditInterno;
        this.addingAuditInterno = false;
        this.uploadingAuditInterno = false;

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
        this.messageService.showMessageError("Errore Inserimento AuditInterno");
        console.error(err);
      });
  }

  async getNomina() {
    console.log(`get AuditInterno dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("AuditInterno")
      .then((f: DocumentoDipendente[]) => {
        this.AuditInterno = f;

        this.AuditInternoDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.AuditInterno
        );
        this.AuditInternoDataSource.paginator = this.AuditInternoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista AuditInterno");
        console.error(err);
      });
  }

  public inputSearchField;
  cleanSearchField() {
    this.AuditInternoDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AuditInternoDataSource.filter = filterValue.trim().toLowerCase();
  }


}
