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
  selector: 'app-nomina-responsabile',
  templateUrl: './nomina-responsabile.component.html',
  styleUrls: ['./nomina-responsabile.component.css']
})
export class NominaResponsabileComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorNominaResponsabile", { static: false })
  NominaResponsabilePaginator: MatPaginator;
  public nuovoNominaResponsabile: DocumentoDipendente;
  public NominaResponsabileDataSource: MatTableDataSource<DocumentoDipendente>;
  public NominaResponsabile: DocumentoDipendente[];
  public uploadingNominaResponsabile: boolean;
  public addingNominaResponsabile: boolean;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingNominaResponsabile = false;
    this.addingNominaResponsabile = false;
    this.nuovoNominaResponsabile = new DocumentoDipendente();
    this.NominaResponsabile = [];
    this.NominaResponsabileDataSource = new MatTableDataSource<DocumentoDipendente>();
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



  // NominaResponsabile
  async addNominaResponsabile() {
    this.addingNominaResponsabile = true;
    this.nuovoNominaResponsabile = {
      filename: undefined,
      note: "",
      type: "NominaResponsabile",
    };
  }

  async uploadNominaResponsabile($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload NominaResponsabile: ", $event);
      this.nuovoNominaResponsabile.filename = file.name;
      this.nuovoNominaResponsabile.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteNominaResponsabile(doc: DocumentoDipendente) {
    console.log("Cancella NominaResponsabile: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("NominaResponsabile cancellata");
        const index = this.NominaResponsabile.indexOf(doc);
        console.log("NominaResponsabile cancellata index: ", index);
        if (index > -1) {
          this.NominaResponsabile.splice(index, 1);
        }

        console.log("NominaResponsabile cancellata this.fatture: ", this.NominaResponsabile);
        this.NominaResponsabileDataSource.data = this.NominaResponsabile;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveNominaResponsabile(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "NominaResponsabile";
    const path = "NominaResponsabile";
    const file: File = doc.file;
    this.uploadingNominaResponsabile = true;

    console.log("Invio NominaResponsabile: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert NominaResponsabile: ", result);
        this.NominaResponsabile.push(result);
        this.NominaResponsabileDataSource.data = this.NominaResponsabile;
        this.addingNominaResponsabile = false;
        this.uploadingNominaResponsabile = false;

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
        this.messageService.showMessageError("Errore Inserimento NominaResponsabile");
        console.error(err);
      });
  }

  async getNomina() {
    console.log(`get NominaResponsabile dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("NominaResponsabile")
      .then((f: DocumentoDipendente[]) => {
        this.NominaResponsabile = f;

        this.NominaResponsabileDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.NominaResponsabile
        );
        this.NominaResponsabileDataSource.paginator = this.NominaResponsabilePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista NominaResponsabile");
        console.error(err);
      });
  }

  public inputSearchField;
  cleanSearchField() {
    this.NominaResponsabileDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NominaResponsabileDataSource.filter = filterValue.trim().toLowerCase();
  }


}
