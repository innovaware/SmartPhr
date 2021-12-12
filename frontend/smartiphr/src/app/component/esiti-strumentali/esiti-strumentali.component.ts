import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-esiti-strumentali',
  templateUrl: './esiti-strumentali.component.html',
  styleUrls: ['./esiti-strumentali.component.css']
})
export class EsitiStrumentaliComponent implements OnInit {
  @Input() id: string;

  typeDocument: string = "EsitoStrumentale";

  addingDocument: boolean = false;
  uploadingDocumento: boolean = false;
  nuovoDocumento: DocumentoPaziente;
  documenti: DocumentoPaziente[];

  public documentiDataSource: MatTableDataSource<DocumentoPaziente>;
  @ViewChild("paginatorDocumenti", { static: false })  documentiPaginator: MatPaginator;
  documentiDisplayedColumns: string[] = ["namefile", "date", "note", "action"];


  constructor(
    public messageService: MessagesService,
    public dialog: MatDialog,
    public docService: PazienteService,
    public uploadService: UploadService
  ) {}

  ngOnInit() {
    this.loadDocumento();
    this.documenti = [];
  }

  AddDocument() {
    this.addingDocument = true;
    this.nuovoDocumento = new DocumentoPaziente();
  }

  uploadDocumento($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoDocumento.filename = file.name;
      this.nuovoDocumento.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  saveDocumento(doc: DocumentoPaziente) {
    if (doc.file == undefined) {
      this.messageService.showMessageError("Selezionare un file");
      return;
    }

    const path = "EsitoStrumentale";
    const file: File = doc.file;
    this.uploadingDocumento = true;

    console.log("Invio documento: ", doc);
    this.docService
      .insertEsitoStrumentale(this.id, doc)
      .subscribe(
        (result: DocumentoPaziente) => {
          console.log("Insert documento: ", result);

          let formData: FormData = new FormData();

          const nameDocument: string = doc.filename;

          formData.append("file", file);
          formData.append("typeDocument", this.typeDocument);
          formData.append("path", `${this.id}/${path}`);
          formData.append("name", nameDocument);

          this.uploadService
            .uploadDocument(formData)
            .then((x) => {
              this.addingDocument = false;
              this.uploadingDocumento = false;

              this.documenti.push(result);
              console.log("Uploading completed: ", result);
              this.documentiDataSource.data = this.documenti;

            })
            .catch((err) => {
              this.messageService.showMessageError("Errore nel caricamento file");
              console.error(err);
              this.addingDocument = false;
              this.uploadingDocumento = false;
            });
        },
        (err) => {
          this.messageService.showMessageError("Errore Inserimento documento");
          console.error(err);
        });
  }

  loadDocumento() {
    this.docService
    .getEsitoStrumentale(this.id)
    .subscribe(
      (result: DocumentoPaziente[]) => {
        console.log("Loaded esiti strumentali: ", result);
        this.documenti = result;

        this.documentiDataSource = new MatTableDataSource<DocumentoPaziente>(this.documenti);
        this.documentiDataSource.paginator = this.documentiPaginator;
      },
      (err) => {
        console.log("Error load esisto Strumentale");
        this.messageService.showMessageError("Errore nel caricamento Documento di Esito Strumentale");
      }
    );
  }

  async showDocument(documento: DocumentoPaziente) {
    this.uploadService
      .download(documento.filename, this.id, this.typeDocument)
      .then((x) => {
        console.log("download: ", x);
        x.subscribe((data) => {
          console.log("download: ", data);
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

  deleteDocument(documento: DocumentoPaziente) {
    console.log("Cancella documento: ", documento);

    this.docService
      .deleteEsitoStrumentale(documento._id)
      .subscribe(
        (x) => {
          console.log("Documento Cancellato");
        const index = this.documenti.indexOf(documento);
        console.log("Documento cancellato index: ", index);
        if (index > -1) {
          this.documenti.splice(index, 1);
        }

        this.documentiDataSource.data = this.documenti;
      },
      (err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione esito strumentale"
        );
        console.error(err);
      });
  }
}
