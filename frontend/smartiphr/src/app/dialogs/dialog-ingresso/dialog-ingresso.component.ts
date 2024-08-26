import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { dataIngresso } from 'src/app/models/dataIngresso';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from 'src/app/models/paziente';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentipazientiService } from 'src/app/service/documentipazienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
@Component({
  selector: 'app-dialog-ingresso',
  templateUrl: './dialog-ingresso.component.html',
  styleUrls: ['./dialog-ingresso.component.css']
})
export class DialogIngressoComponent implements OnInit {

  @ViewChild("paginatorDocumentIndumentiConsigliati", { static: false })
  DocumentIndumentiConsigliatiPaginator: MatPaginator;
  public nuovoDocumentoIndumentiConsigliati: DocumentoPaziente;
  public DocumentIndumentiConsigliatiDataSource: MatTableDataSource<DocumentoPaziente>;
  public documentiIndumentiConsigliati: DocumentoPaziente[] = [];
  public uploadingDocumentoIndumentiConsigliati: boolean;
  public addingDocumentoIndumentiConsigliati: boolean;


  @ViewChild("paginatorDocumentIndumenti", { static: false })
  DocumentoIndumentiPaginator: MatPaginator;
  public nuovoDocumentoIndumenti: DocumentoPaziente;
  public DocumentIndumentiDataSource: MatTableDataSource<DocumentoPaziente>;
  public documentiIndumenti: DocumentoPaziente[] = [];
  public uploadingDocumentoIndumenti: boolean;
  public addingDocumentoIndumenti: boolean;

  paziente: Paziente;
  ingresso: dataIngresso;
  dipendente: Dipendenti = {} as Dipendenti;
  utente: User = {} as User;
  update: Boolean;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  constructor(public dialogRef: MatDialogRef<DialogIngressoComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public dataIngressoService: DataIngressoService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) {
    this.paziente = Paziente.clone(data.paziente);
    this.ingresso = new dataIngresso();
    this.update = false;
  }



  ngOnInit() {

    this.update = false;
    this.paziente = this.data.paziente;
    this.loadUser();
    this.getDocumentiIndumenti();
    this.getDocumentiIndumentiConsigliati();
    this.getIngresso();
  }



  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
   
      this.dipendenteService
        .getByIdUser(user.dipendenteID)
        .then((x) => {
          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }



  async showDocument(documento: DocumentoPaziente) {
    try {
    

      const response = await this.uploadService.download(documento.filename, documento.paziente, documento.typeDocument);
     

      response.subscribe(
        (data) => {
        

          try {
            const newBlob = new Blob([data as BlobPart], { type: "application/pdf" });
          

            const nav = window.navigator as any;

            if (nav.msSaveOrOpenBlob) {
              
              nav.msSaveOrOpenBlob(newBlob);
            } else {
              const downloadURL = URL.createObjectURL(newBlob);
             
              window.open(downloadURL);
            }
          } catch (blobError) {
            this.messageService.showMessageError("Errore nella creazione del file Blob");
            console.error("Errore nella creazione del Blob o nell'apertura del file:", blobError);
          }
        },
        (error) => {
          this.messageService.showMessageError("Errore durante il caricamento del file");
          console.error("Errore durante la sottoscrizione del download del file:", error);
        }
      );
    } catch (err) {
      this.messageService.showMessageError("Errore durante l'inizio del caricamento del file");
      console.error("Errore durante l'inizio del download del file:", err);
    }
  }




  // DOCUMENTI INDUMENTI
  async addDocumentoIndumenti() {
    this.addingDocumentoIndumenti = true;
    this.nuovoDocumentoIndumenti = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Indumenti",
      typeDocument: "Indumenti",
    };
  }

  async uploadDocumentoIndumenti($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

     
      this.nuovoDocumentoIndumenti.filename = file.name;
      this.nuovoDocumentoIndumenti.file = file;
      this.nuovoDocumentoIndumenti.type = "Indumenti";
      this.nuovoDocumentoIndumenti.typeDocument = "Indumenti";
    } else {
      this.messageService.showMessageError("File non valido");
     
    }
  }

  async deleteDocumentoIndumenti(doc: DocumentoPaziente) {

    this.docService
      .remove(doc)
      .then((x) => {
        const index = this.documentiIndumenti.indexOf(doc);
        if (index > -1) {
          this.documentiIndumenti.splice(index, 1);
        }

        this.DocumentIndumentiDataSource.data = this.documentiIndumenti;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async saveDocumentoIndumenti(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }

    doc.type = "Indumenti";
    doc.typeDocument = "Indumenti";

    const typeDocument = doc.typeDocument;
    const path = doc.typeDocument;
    const file: File = doc.file;
    this.uploadingDocumentoIndumenti = true;



    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        this.documentiIndumenti.push(result);
        this.DocumentIndumentiDataSource.data = this.documentiIndumenti;
        this.addingDocumentoIndumenti = false;
        this.uploadingDocumentoIndumenti = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploadingDocumentoIndumenti = false;

          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploadingDocumentoIndumenti = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento documento");
        console.error(err);
      });
  }

  async getDocumentiIndumenti() {
    this.docService
      .get(this.paziente, "Indumenti")
      .then((f: DocumentoPaziente[]) => {
        this.documentiIndumenti = f;

        this.DocumentIndumentiDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.documentiIndumenti
        );
        this.DocumentIndumentiDataSource.paginator = this.DocumentoIndumentiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Documento"
        );
        console.error(err);
      });
  }


  // DOCUMENTI INDUMENTI CONSIGLIATI
  async addDocumentoIndumentiConsigliati() {
    this.addingDocumentoIndumentiConsigliati = true;
    this.nuovoDocumentoIndumentiConsigliati = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "IndumentoConsigliati",
      typeDocument: "IndumentoConsigliati",
    };
  }

  async uploadDocumentoIndumentiConsigliati($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      this.nuovoDocumentoIndumentiConsigliati.filename = file.name;
      this.nuovoDocumentoIndumentiConsigliati.file = file;
      this.nuovoDocumentoIndumentiConsigliati.type = "IndumentoConsigliati";
      this.nuovoDocumentoIndumentiConsigliati.typeDocument = "IndumentoConsigliati";
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocumento(doc: DocumentoPaziente) {

    this.docService
      .remove(doc)
      .then((x) => {
        const index = this.documentiIndumentiConsigliati.indexOf(doc);
        if (index > -1) {
          this.documentiIndumentiConsigliati.splice(index, 1);
        }

        this.DocumentIndumentiConsigliatiDataSource.data = this.documentiIndumentiConsigliati;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
        console.error(err);
      });
  }

  async saveDocumento(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    doc.type = "IndumentoConsigliati";
    doc.typeDocument = "IndumentoConsigliati";
    const typeDocument = doc.typeDocument;
    const path = doc.typeDocument;
    const file: File = doc.file;
    this.uploadingDocumentoIndumentiConsigliati = true;



    // doc.type = this.nuovoDocumento.typeDocument;
    // doc.typeDocument = "ingresso";

    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        this.documentiIndumentiConsigliati.push(result);
        this.DocumentIndumentiConsigliatiDataSource.data = this.documentiIndumentiConsigliati;
        this.addingDocumentoIndumentiConsigliati = false;
        this.uploadingDocumentoIndumentiConsigliati = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploadingDocumentoIndumentiConsigliati = false;

          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploadingDocumentoIndumentiConsigliati = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento documento");
        console.error(err);
      });
  }

  async getDocumentiIndumentiConsigliati() {
    this.docService
      .get(this.paziente, "IndumentoConsigliati")
      .then((f: DocumentoPaziente[]) => {
        this.documentiIndumentiConsigliati = f;
        this.DocumentIndumentiConsigliatiDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.documentiIndumentiConsigliati
        );
        this.DocumentIndumentiConsigliatiDataSource.paginator = this.DocumentIndumentiConsigliatiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Documento"
        );
        console.error(err);
      });
  }


  //INGRESSO

  async getIngresso() {
    this.dataIngressoService.getIngressoByPaziente(this.paziente._id).then((result) => {
      this.ingresso = result[0] == undefined ? {} : result[0];
      this.update = result[0] == undefined ? false : true;
    });
  }


  async saveIngresso() {

    this.ingresso.user = this.dipendente != undefined ? this.dipendente._id : "";
    this.ingresso.paziente = this.paziente._id;
    this.dataIngressoService
      .insertIngresso(this.ingresso)
      .then((result: dataIngresso) => {

      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento dataIngresso");
        console.error(err);
      });
  }


  async updateIngresso() {
    this.dataIngressoService
      .updateIngresso(this.ingresso)
      .then((result: dataIngresso) => {

      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Nodifica dataIngresso");
        console.error(err);
      });
  }


}
