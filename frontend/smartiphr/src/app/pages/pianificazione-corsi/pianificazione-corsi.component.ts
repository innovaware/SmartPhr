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
import { Evento } from '../../models/evento';
import { EventiService } from '../../service/eventi.service';
import { User } from '../../models/user';
import { DialogEventComponent } from '../../dialogs/dialog-event/dialog-event.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pianificazione-corsi',
  templateUrl: './pianificazione-corsi.component.html',
  styleUrls: ['./pianificazione-corsi.component.css']
})
export class PianificazioneCorsiComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti;
  user: User;
  tipo: string;
  url: string;
  isTurni: Boolean;
  inputSearchField1: String;
  inputSearchField2: String;
  inputSearchField3: String;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  DisplayedColumnsEvents: string[] = ["evento", "dateCreazione", "dateEvento", "status", "dateCompletato", "action"];

  public admin: Boolean;
  @ViewChild("paginatorPianificazioneCorsi", { static: false })
  PianificazioneCorsiPaginator: MatPaginator;
  public nuovoPianificazioneCorsi: DocumentoDipendente;
  public PianificazioneCorsiDataSource: MatTableDataSource<DocumentoDipendente>;
  public PianificazioneCorsi: DocumentoDipendente[];
  public EventCorsiDataSource: MatTableDataSource<Evento>;
  public Eventi: Evento[];
  @ViewChild("EventiPaginator", { static: false })
  EventiPaginator: MatPaginator;
  public uploadingPianificazioneCorsi: boolean;
  public addingPianificazioneCorsi: boolean;

  @ViewChild("paginatorArchivioVerbale", { static: false })
  ArchivioVerbalePaginator: MatPaginator;
  public nuovoArchivioVerbale: DocumentoDipendente;
  public ArchivioVerbaleDataSource: MatTableDataSource<DocumentoDipendente>;
  public ArchivioVerbaleCorsi: DocumentoDipendente[];
  public ArchivioVerbale: DocumentoDipendente[];
  public uploadingArchivioVerbale: boolean;
  public addingArchivioVerbale: boolean;




  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService,
    public eventiService: EventiService) {
    this.dipendente = new Dipendenti();
    this.loadUser();
    this.uploadingPianificazioneCorsi = false;
    this.addingPianificazioneCorsi = false;
    this.nuovoPianificazioneCorsi = new DocumentoDipendente();
    this.PianificazioneCorsi = [];
    this.PianificazioneCorsiDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.tipo = "corsi";
    this.url = "/pianificazione_corsi";
    this.isTurni = false;
    this.Eventi = [];
    this.EventCorsiDataSource = new MatTableDataSource<Evento>();
    this.getEvents();
    this.uploadingArchivioVerbale = false;
    this.addingArchivioVerbale = false;
    this.nuovoArchivioVerbale = new DocumentoDipendente();
    this.ArchivioVerbale = [];
    this.ArchivioVerbaleDataSource = new MatTableDataSource<DocumentoDipendente>();
  }

  ngOnInit() {
    this.getEvents();
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
            this.getPianificazioneCorsi();
            this.getArchivioVerbale();
            this.user = user;
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



  // PianificazioneCorsi
  async addPianificazioneCorsi() {
    this.addingPianificazioneCorsi = true;
    this.nuovoPianificazioneCorsi = {
      filename: undefined,
      note: "",
      type: "PianificazioneCorsi",
    };
  }

  async uploadPianificazioneCorsi($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload PianificazioneCorsi: ", $event);
      this.nuovoPianificazioneCorsi.filename = file.name;
      this.nuovoPianificazioneCorsi.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deletePianificazioneCorsi(doc: DocumentoDipendente) {
    console.log("Cancella PianificazioneCorsi: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("PianificazioneCorsi cancellata");
        const index = this.PianificazioneCorsi.indexOf(doc);
        console.log("PianificazioneCorsi cancellata index: ", index);
        if (index > -1) {
          this.PianificazioneCorsi.splice(index, 1);
        }

        console.log("PianificazioneCorsi cancellata this.fatture: ", this.PianificazioneCorsi);
        this.PianificazioneCorsiDataSource.data = this.PianificazioneCorsi;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async savePianificazioneCorsi(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "PianificazioneCorsi";
    const path = "PianificazioneCorsi";
    const file: File = doc.file;
    this.uploadingPianificazioneCorsi = true;

    console.log("Invio PianificazioneCorsi: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert PianificazioneCorsi: ", result);
        this.PianificazioneCorsi.push(result);
        this.PianificazioneCorsiDataSource.data = this.PianificazioneCorsi;
        this.addingPianificazioneCorsi = false;
        this.uploadingPianificazioneCorsi = false;

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
        this.messageService.showMessageError("Errore Inserimento PianificazioneCorsi");
        console.error(err);
      });
  }

  async getPianificazioneCorsi() {
    console.log(`get PianificazioneCorsi dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("PianificazioneCorsi")
      .then((f: DocumentoDipendente[]) => {
        this.PianificazioneCorsi = f;

        this.PianificazioneCorsiDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.PianificazioneCorsi
        );
        this.PianificazioneCorsiDataSource.paginator = this.PianificazioneCorsiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista PianificazioneCorsi");
        console.error(err);
      });
  }


  async getEvents() {
    this.eventiService.getEventiByType(this.tipo).then((result) => {
      this.Eventi = result.sort((a, b) => {
        const dateA = new Date(a.data)
        const dateB = new Date(b.data);
        return dateB.getTime() - dateA.getTime();
      });
      this.EventCorsiDataSource.data = this.Eventi;
      this.EventCorsiDataSource.paginator = this.EventiPaginator;
    });
  }
  async updateEvent(evento: Evento) {
    var ev = evento;
    evento.finito = true;
    evento.dataCompletato = new Date();
    this.eventiService.updateEvento(evento).then((res) => {
      const index = this.Eventi.indexOf(ev);
      this.Eventi[index] = evento;
      this.EventCorsiDataSource.data = this.Eventi;
      this.EventCorsiDataSource.paginator = this.EventiPaginator;
    });
  }

  async AddEvento() {
    var event: Evento = {
      data: new Date(),
      descrizione: "",
      tipo: "",
      utente: "",
    };

    var dialogRef = this.dialog.open(DialogEventComponent, {
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      let evento: Evento = result;
      evento.utente = this.user.username;
      evento.tipo = this.tipo;

      this.eventiService.insertEvento(evento)
        .then((res: Evento) => {

          console.log('Evento inserito con successo:', res);
          this.Eventi.push(res);
          this.EventCorsiDataSource.data = [...this.Eventi].sort((a, b) => {
            const dateA = new Date(a.data);
            const dateB = new Date(b.data);
            return dateB.getTime() - dateA.getTime();
          });

          if (this.EventiPaginator) {
            this.EventCorsiDataSource.paginator = this.EventiPaginator;
          } else {
            console.warn("Paginatore non inizializzato.");
          }

          // Aggiorna i dati dopo l'inserimento
          this.getEvents();
        })
        .catch((err) => {
          console.error("Errore nell'inserimento degli eventi", err);
          this.messageService.showMessageError(
            "Errore: Inserimento Evento fallito (" + err["status"] + ")"
          );
        });
    });
  }



  // ArchivioVerbal
  async addArchivioVerbale() {
    this.addingArchivioVerbale = true;
    this.nuovoArchivioVerbale = {
      filename: undefined,
      note: "",
      type: "ArchivioVerbale",
    };
  }

  async uploadArchivioVerbale($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload ArchivioVerbale: ", $event);
      this.nuovoArchivioVerbale.filename = file.name;
      this.nuovoArchivioVerbale.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteArchivioVerbale(doc: DocumentoDipendente) {
    console.log("Cancella ArchivioVerbale: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("ArchivioVerbale cancellata");
        const index = this.ArchivioVerbale.indexOf(doc);
        console.log("ArchivioVerbale cancellata index: ", index);
        if (index > -1) {
          this.ArchivioVerbale.splice(index, 1);
        }

        console.log("ArchivioVerbale cancellata this.fatture: ", this.ArchivioVerbale);
        this.ArchivioVerbaleDataSource.data = this.ArchivioVerbale;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }



  async saveArchivioVerbale(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "ArchivioVerbale";
    const path = "ArchivioVerbale";
    const file: File = doc.file;
    this.uploadingArchivioVerbale = true;

    console.log("Invio ArchivioVerbale: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert ArchivioVerbale: ", result);
        this.ArchivioVerbale.push(result);
        this.ArchivioVerbaleDataSource.data = this.ArchivioVerbale;
        this.addingArchivioVerbale = false;
        this.uploadingArchivioVerbale = false;

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
        this.messageService.showMessageError("Errore Inserimento ArchivioVerbale");
        console.error(err);
      });
  }

  async getArchivioVerbale() {
    console.log(`get ArchivioVerbale dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("ArchivioVerbale")
      .then((f: DocumentoDipendente[]) => {
        this.ArchivioVerbale = f;

        this.ArchivioVerbaleDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.ArchivioVerbale
        );
        this.ArchivioVerbaleDataSource.paginator = this.ArchivioVerbalePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista ArchivioVerbale");
        console.error(err);
      });
  }

  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "archivioVerbale") this.ArchivioVerbaleDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "pianificazioneCorsi") this.PianificazioneCorsiDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "statusCorsi") this.EventCorsiDataSource.filter = filterValue.trim().toLowerCase();
  }
  cleanSearchField(type: string) {
    if (type == "statusCorsi") {
      this.EventCorsiDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }
    if (type == "archivioVerbale") {
      this.ArchivioVerbaleDataSource.filter = undefined;
      this.inputSearchField3 = undefined;
    }
    if (type == "pianificazioneCorsi") {
      this.PianificazioneCorsiDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }

  }
}
