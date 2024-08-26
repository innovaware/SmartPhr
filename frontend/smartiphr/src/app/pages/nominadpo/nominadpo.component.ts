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
  selector: 'app-nominadpo',
  templateUrl: './nominadpo.component.html',
  styleUrls: ['./nominadpo.component.css']
})
export class NominaDPOComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;
  public inputSearchField;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorNominaDPO", { static: false })
  NominaDPOPaginator: MatPaginator;
  public nuovoNominaDPO: DocumentoDipendente;
  public NominaDPODataSource: MatTableDataSource<DocumentoDipendente>;
  public NominaDPO: DocumentoDipendente[];
  public uploadingNominaDPO: boolean;
  public addingNominaDPO: boolean;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingNominaDPO = false;
    this.addingNominaDPO = false;
    this.nuovoNominaDPO = new DocumentoDipendente();
    this.NominaDPO = [];
    this.NominaDPODataSource = new MatTableDataSource<DocumentoDipendente>();
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



  // NominaDPO
  async addNominaDPO() {
    this.addingNominaDPO = true;
    this.nuovoNominaDPO = {
      filename: undefined,
      note: "",
      type: "NominaDPO",
    };
  }

  async uploadNominaDPO($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload NominaDPO: ", $event);
      this.nuovoNominaDPO.filename = file.name;
      this.nuovoNominaDPO.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteNominaDPO(doc: DocumentoDipendente) {
    console.log("Cancella NominaDPO: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("NominaDPO cancellata");
        const index = this.NominaDPO.indexOf(doc);
        console.log("NominaDPO cancellata index: ", index);
        if (index > -1) {
          this.NominaDPO.splice(index, 1);
        }

        console.log("NominaDPO cancellata this.fatture: ", this.NominaDPO);
        this.NominaDPODataSource.data = this.NominaDPO;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveNominaDPO(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "NominaDPO";
    const path = "NominaDPO";
    const file: File = doc.file;
    this.uploadingNominaDPO = true;

    console.log("Invio NominaDPO: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert NominaDPO: ", result);
        this.NominaDPO.push(result);
        this.NominaDPODataSource.data = this.NominaDPO;
        this.addingNominaDPO = false;
        this.uploadingNominaDPO = false;

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
        this.messageService.showMessageError("Errore Inserimento NominaDPO");
        console.error(err);
      });
  }

  async getNomina() {
    console.log(`get NominaDPO dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("NominaDPO")
      .then((f: DocumentoDipendente[]) => {
        this.NominaDPO = f;

        this.NominaDPODataSource = new MatTableDataSource<DocumentoDipendente>(
          this.NominaDPO
        );
        this.NominaDPODataSource.paginator = this.NominaDPOPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista NominaDPO");
        console.error(err);
      });
  }
  
  cleanSearchField() {
    this.NominaDPODataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.NominaDPODataSource.filter = filterValue.trim().toLowerCase();
  }

}
