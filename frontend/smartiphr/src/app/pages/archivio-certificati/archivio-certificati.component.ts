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
  selector: 'app-archivio-certificati',
  templateUrl: './archivio-certificati.component.html',
  styleUrls: ['./archivio-certificati.component.css']
})
export class ArchivioCertificatiComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "dataScadenza", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorArchivioCertificati", { static: false })
  ArchivioCertificatiPaginator: MatPaginator;
  public nuovoArchivioCertificati: DocumentoDipendente;
  public ArchivioCertificatiDataSource: MatTableDataSource<DocumentoDipendente>;
  public ArchivioCertificati: DocumentoDipendente[];
  public uploadingArchivioCertificati: boolean;
  public addingArchivioCertificati: boolean;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingArchivioCertificati = false;
    this.addingArchivioCertificati = false;
    this.nuovoArchivioCertificati = new DocumentoDipendente();
    this.ArchivioCertificati = [];
    this.ArchivioCertificatiDataSource = new MatTableDataSource<DocumentoDipendente>();
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



  // ArchivioCertificati
  async addArchivioCertificati() {
    this.addingArchivioCertificati = true;
    this.nuovoArchivioCertificati = {
      filename: undefined,
      note: "",
      type: "ArchivioCertificati",
    };
  }

  async uploadArchivioCertificati($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload ArchivioCertificati: ", $event);
      this.nuovoArchivioCertificati.filename = file.name;
      this.nuovoArchivioCertificati.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteArchivioCertificati(doc: DocumentoDipendente) {
    console.log("Cancella ArchivioCertificati: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("ArchivioCertificati cancellata");
        const index = this.ArchivioCertificati.indexOf(doc);
        console.log("ArchivioCertificati cancellata index: ", index);
        if (index > -1) {
          this.ArchivioCertificati.splice(index, 1);
        }

        console.log("ArchivioCertificati cancellata this.fatture: ", this.ArchivioCertificati);
        this.ArchivioCertificatiDataSource.data = this.ArchivioCertificati;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveArchivioCertificati(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "ArchivioCertificati";
    const path = "ArchivioCertificati";
    const file: File = doc.file;
    this.uploadingArchivioCertificati = true;

    console.log("Invio ArchivioCertificati: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert ArchivioCertificati: ", result);
        this.ArchivioCertificati.push(result);
        this.ArchivioCertificatiDataSource.data = this.ArchivioCertificati;
        this.addingArchivioCertificati = false;
        this.uploadingArchivioCertificati = false;

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

        let filename = "";
        this.ArchivioCertificati.forEach((s) => {
          if (this.VerificaMesi(s.dataScadenza)) {
            if (filename === "") filename += "I File: ";
            filename += `${s.filename},\n`;
          }
        });

        if (filename !== "") {
          filename += "Scadranno a Breve\n";
          this.messageService.showMessage(filename);
        }
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento ArchivioCertificati");
        console.error(err);
      });
  }

  VerificaMesi(dataEvento: Date): boolean {
    // Ottieni la data corrente
    const oggi = new Date();

    // Clona la data dell'evento per evitare di modificarla
    const dataClonata = new Date(dataEvento);

    // Aggiungi due mesi alla data dell'evento
    dataClonata.setMonth(dataClonata.getMonth() - 2);

    // Verifica se la data corrente è esattamente due mesi prima dell'evento
    return oggi >= dataClonata;
  }


  async getNomina() {
    console.log(`get ArchivioCertificati dipendente: ${this.dipendente._id}`);
    try {
      const f = await this.docService.getByType("ArchivioCertificati");
      this.ArchivioCertificati = f;

      let file = "";
      this.ArchivioCertificati.forEach((s) => {
        if (this.VerificaMesi(s.dataScadenza)) {
          if (file === "") file += "I File: ";
          file += `${s.filename},\n`;
        }
      });

      if (file !== "") {
        file += "Scadranno a Breve\n";
        this.messageService.showMessage(file);
      }

      this.ArchivioCertificatiDataSource = new MatTableDataSource<DocumentoDipendente>(
        this.ArchivioCertificati
      );
      this.ArchivioCertificatiDataSource.paginator = this.ArchivioCertificatiPaginator;
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento lista ArchivioCertificati");
      console.error(err);
    }
  }


  public inputSearchField;
  cleanSearchField() {
    this.ArchivioCertificatiDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ArchivioCertificatiDataSource.filter = filterValue.trim().toLowerCase();
  }


}
