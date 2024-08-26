import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { Cambiturno } from "src/app/models/cambiturni";
import { Dipendenti } from "src/app/models/dipendenti";
import { CambiturniService } from "src/app/service/cambiturni.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { DocumentoDipendente } from "../../models/documentoDipendente";
import { DocumentiService } from "../../service/documenti.service";
import { UploadService } from "../../service/upload.service";

@Component({
  selector: "app-cambiturno",
  templateUrl: "./cambiturno.component.html",
  styleUrls: ["./cambiturno.component.css"],
})
export class CambiturnoComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;
  @Input() dipendente: Dipendenti;
  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    cambiturno: Cambiturno;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;
  isChecked: boolean;
  displayedColumns: string[] = ["namefile", "dateInizio", "note",  "accettata", "file",  "accetta", "rifiuta"];
  //displayedColumns: string[] = ["namefile", "dateInizio", "note", "accettata", "action"];

  DisplayedColumns1: string[] = ["namefile", "dateInizio", "note", "accettata", "action"];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public nuovoCambio: Cambiturno;
  public nuovoCambioTurno: DocumentoDipendente;
  dataSource: MatTableDataSource<Cambiturno>;
  cambiDataSource: MatTableDataSource<DocumentoDipendente>= new MatTableDataSource<DocumentoDipendente>();
  public cambiturno: Cambiturno[] = [];
  public cambiturnoDoc: DocumentoDipendente[] = [];
  public uploadingCambiturno: boolean;
  public uploadingCambio: boolean;
  public addingCambiturno: boolean;
  public addingCambio: boolean;
  @ViewChild("paginatorCambio", { static: false })
  cambioPaginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public cambiturniService: CambiturniService,
    public dipendenteService: DipendentiService,
    public docService: DocumentiService,
    public uploadService: UploadService
  ) {
    this.uploadingCambio = false;
    this.addingCambio = false;
    this.isChecked = false;
    this.cambiturno = [];
    this.cambiturnoDoc = [];

    this.cambiDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.nuovoCambioTurno = new DocumentoDipendente();
  //  this.getCambiTurno();
  }

  ngOnChanges(changes) {

    if (this.data) {
      this.dataSource = new MatTableDataSource<Cambiturno>(this.cambiturno);
      this.dataSource.paginator = this.paginator;
      this.cambiturnoDoc = [];
      this.cambiDataSource = new MatTableDataSource<DocumentoDipendente>();
      this.cambiDataSource.paginator = this.cambioPaginator;

      this.isChecked = false;
      this.getCambiTurno();
    } else {
      console.warn("ngOnChanges: data o dipendente non sono definiti");
    }
  }

  ngOnInit() {

    if (this.data) {
      this.isChecked = false;
      this.cambiturnoDoc = [];
      this.cambiDataSource = new MatTableDataSource<DocumentoDipendente>();
      this.cambiDataSource.paginator = this.cambioPaginator;
      this.getCambiTurno();
    } else {
      console.warn("ngOnInit: data o dipendente non sono definiti");
    }
  }


  ngAfterViewInit() { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(cambiturno: Cambiturno, item: string) {
    this.showItemEmiter.emit({ cambiturno: cambiturno, button: item });
  }

  async updateCambioturno(cambio: Cambiturno) {
    this.cambiturniService
      .updateCambioturno(cambio)
      .then((result: Cambiturno) => {
        const index = this.cambiturno.indexOf(cambio);
        cambio.closed = true;
        this.cambiturno[index] = cambio;
        this.dataSource.data = this.cambiturno;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore modifica stato Cambiturno"
        );
        console.error(err);
      });
  }

  sendResp(row) {
    let fId = row._id;
    let message = "Sei sicuro di voler respingere questa richiesta?";

    let result = window.confirm(message);
    if (result) {
      row.closed = true;
      row.accettata = false;
      this.updateCambioTurno(row);
    }
  }
  sendAccetto(row) {
    let fId = row._id;
    let message = "Sei sicuro di voler accettare questa richiesta?";

    let result = window.confirm(message);
    if (result) {
      row.closed = true;
      row.accettata = true;
      this.updateCambioTurno(row);
    }
  }

  toggleCheckbox(element) {
    if (element.accettata) this.isChecked = true;
    else this.isChecked = false;
  }

  addRichiestaCambiturno() {

  }
  //////// Lato Area Personale
  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, this.data)
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


  // Cambio
  async addCambio() {
    this.addingCambio = true;
    this.nuovoCambioTurno = {
      filename: undefined,
      note: "",
      type: "CambioTurno",
    };
  }

  async uploadCambio($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoCambioTurno.filename = file.name;
      this.nuovoCambioTurno.file = file;
      this.nuovoCambioTurno.type = "CambioTurno";

    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteCambioTurno(doc: DocumentoDipendente) {

    this.docService
      .remove(doc)
      .then((x) => {
        const index = this.cambiturnoDoc.indexOf(doc);
        if (index > -1) {
          this.cambiturnoDoc.splice(index, 1);
        }
        
        this.cambiDataSource.data = this.cambiturnoDoc;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione cambio turno");
        console.error(err);
      });
  }

  async saveCambio(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire File");
      return;
    }
    const typeDocument = "CambioTurno";
    const path = "CambioTurno";
    const file: File = doc.file;
    this.uploadingCambio = true;

    this.docService
      .insert(doc, this.data)
      .then((result: DocumentoDipendente) => {
        this.cambiturnoDoc.push(result);
        this.cambiDataSource.data = this.cambiturnoDoc;
        this.addingCambio = false;
        this.uploadingCambio = false;

        let formData: FormData = new FormData();
        const nameDocument: string = doc.filename;
        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.data._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploadingCambio = false;

          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploadingCambio = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento file");
        console.error(err);
      });
  }

  async getCambiTurno() {
    try {
      if (!this.data || !this.dipendente) {
        throw new Error("Dati mancanti: data o dipendenti non sono definiti.");
      }

      const f = await this.docService.get(this.data, "CambioTurno");

      if (!f || !Array.isArray(f)) {
        throw new Error("Il risultato del servizio non è valido.");
      }

      this.cambiturnoDoc = f;
      this.cambiDataSource.data = this.cambiturnoDoc;

      if (this.cambioPaginator) {
        this.cambiDataSource.paginator = this.cambioPaginator;
      } else {
        console.warn("cambioPaginator non è definito.");
      }
      
    } catch (err) {
      console.error("Errore durante il caricamento della lista cambi turno:", err);
      //this.messageService.showMessageError("Errore caricamento lista cambi turno");
    }
  }

  async updateCambioTurno(cambio: DocumentoDipendente) {
    this.docService
      .update(cambio)
      .then((result: DocumentoDipendente) => {
        const index = this.cambiturnoDoc.indexOf(cambio);
        this.cambiturnoDoc[index] = cambio;
        this.cambiDataSource.data = this.cambiturnoDoc;
        this.cambiDataSource.paginator = this.cambioPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore modifica stato Cambi turno"
        );
        console.error(err);
      });
  }
}
