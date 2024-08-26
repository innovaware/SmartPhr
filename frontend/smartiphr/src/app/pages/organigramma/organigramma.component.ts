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
  selector: 'app-organigramma',
  templateUrl: './organigramma.component.html',
  styleUrls: ['./organigramma.component.css']
})
export class OrganigrammaComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorOrganigramma", { static: false })
  OrganigrammaPaginator: MatPaginator;
  public nuovoOrganigramma: DocumentoDipendente;
  public OrganigrammaDataSource: MatTableDataSource<DocumentoDipendente>;
  public Organigramma: DocumentoDipendente[];
  public uploadingOrganigramma: boolean;
  public addingOrganigramma: boolean;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingOrganigramma = false;
    this.addingOrganigramma = false;
    this.nuovoOrganigramma = new DocumentoDipendente();
    this.Organigramma = [];
    this.OrganigrammaDataSource = new MatTableDataSource<DocumentoDipendente>();
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



  // Organigramma
  async addOrganigramma() {
    this.addingOrganigramma = true;
    this.nuovoOrganigramma = {
      filename: undefined,
      note: "",
      type: "Organigramma",
    };
  }

  async uploadOrganigramma($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Organigramma: ", $event);
      this.nuovoOrganigramma.filename = file.name;
      this.nuovoOrganigramma.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteOrganigramma(doc: DocumentoDipendente) {
    console.log("Cancella Organigramma: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Organigramma cancellata");
        const index = this.Organigramma.indexOf(doc);
        console.log("Organigramma cancellata index: ", index);
        if (index > -1) {
          this.Organigramma.splice(index, 1);
        }

        console.log("Organigramma cancellata this.fatture: ", this.Organigramma);
        this.OrganigrammaDataSource.data = this.Organigramma;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveOrganigramma(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Organigramma";
    const path = "Organigramma";
    const file: File = doc.file;
    this.uploadingOrganigramma = true;

    console.log("Invio Organigramma: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Organigramma: ", result);
        this.Organigramma.push(result);
        this.OrganigrammaDataSource.data = this.Organigramma;
        this.addingOrganigramma = false;
        this.uploadingOrganigramma = false;

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
        this.messageService.showMessageError("Errore Inserimento Organigramma");
        console.error(err);
      });
  }

  async getNomina() {
    console.log(`get Organigramma dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("Organigramma")
      .then((f: DocumentoDipendente[]) => {
        this.Organigramma = f;

        this.OrganigrammaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.Organigramma
        );
        this.OrganigrammaDataSource.paginator = this.OrganigrammaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Organigramma");
        console.error(err);
      });
  }


  public inputSearchField;
  cleanSearchField() {
    this.OrganigrammaDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.OrganigrammaDataSource.filter = filterValue.trim().toLowerCase();
  }



}
