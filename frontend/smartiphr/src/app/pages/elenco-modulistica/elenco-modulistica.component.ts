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
  selector: 'app-elenco-modulistica',
  templateUrl: './elenco-modulistica.component.html',
  styleUrls: ['./elenco-modulistica.component.css']
})
export class ElencoModulisticaComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorElencoModulistica", { static: false })
  ElencoModulisticaPaginator: MatPaginator;
  public nuovoElencoModulistica: DocumentoDipendente;
  public ElencoModulisticaDataSource: MatTableDataSource<DocumentoDipendente>;
  public ElencoModulistica: DocumentoDipendente[];
  public uploadingElencoModulistica: boolean;
  public addingElencoModulistica: boolean;
  public inputSearchField: String;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingElencoModulistica = false;
    this.addingElencoModulistica = false;
    this.nuovoElencoModulistica = new DocumentoDipendente();
    this.ElencoModulistica = [];
    this.ElencoModulisticaDataSource = new MatTableDataSource<DocumentoDipendente>();
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



  // ElencoModulistica
  async addElencoModulistica() {
    this.addingElencoModulistica = true;
    this.nuovoElencoModulistica = {
      filename: undefined,
      note: "",
      type: "ElencoModulistica",
    };
  }

  async uploadElencoModulistica($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload ElencoModulistica: ", $event);
      this.nuovoElencoModulistica.filename = file.name;
      this.nuovoElencoModulistica.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteElencoModulistica(doc: DocumentoDipendente) {
    console.log("Cancella ElencoModulistica: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("ElencoModulistica cancellata");
        const index = this.ElencoModulistica.indexOf(doc);
        console.log("ElencoModulistica cancellata index: ", index);
        if (index > -1) {
          this.ElencoModulistica.splice(index, 1);
        }

        console.log("ElencoModulistica cancellata this.fatture: ", this.ElencoModulistica);
        this.ElencoModulisticaDataSource.data = this.ElencoModulistica;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveElencoModulistica(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "ElencoModulistica";
    const path = "ElencoModulisticaInUso";
    const file: File = doc.file;
    this.uploadingElencoModulistica = true;

    console.log("Invio ElencoModulistica: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert ElencoModulistica: ", result);
        this.ElencoModulistica.push(result);
        this.ElencoModulisticaDataSource.data = this.ElencoModulistica;
        this.addingElencoModulistica = false;
        this.uploadingElencoModulistica = false;

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
        this.messageService.showMessageError("Errore Inserimento ElencoModulistica");
        console.error(err);
      });
  }

  async getNomina() {
    console.log(`get ElencoModulistica dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("ElencoModulistica")
      .then((f: DocumentoDipendente[]) => {
        this.ElencoModulistica = f;

        this.ElencoModulisticaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.ElencoModulistica
        );
        this.ElencoModulisticaDataSource.paginator = this.ElencoModulisticaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista ElencoModulistica");
        console.error(err);
      });
  }

  cleanSearchField() {
    this.ElencoModulisticaDataSource.filter = undefined;
      this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ElencoModulisticaDataSource.filter = filterValue.trim().toLowerCase();
  }
}
