import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoAutoControllo } from 'src/app/models/DocumentoAutoControllo';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-cucina-auto-controllo',
  templateUrl: './cucina-auto-controllo.component.html',
  styleUrls: ['./cucina-auto-controllo.component.css']
})
export class CucinaAutoControlloComponent implements OnInit {

  addingDocument: boolean = false;
  nuovoDocumento: DocumentoAutoControllo;
  uploadingDocumento: boolean = false;

  documenti: DocumentoAutoControllo[];
  public documentiDataSource: MatTableDataSource<DocumentoAutoControllo>;
  @ViewChild("paginatorDocumenti", {static: false})  documentiPaginator: MatPaginator;
  documentiDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  constructor(
    private uploadService: UploadService,
    private messageService: MessagesService,
    private cucinaService: CucinaService
  ) { }

  ngOnInit(): void {
    this.loadDocumento();
  }

  loadDocumento() {
    this.cucinaService
    .getDocumentoAutoControllo()
    .subscribe(
      (result: DocumentoAutoControllo[]) => {
        console.log("Loaded document: ", result);
        this.documenti = result || [];

        this.documentiDataSource = new MatTableDataSource<DocumentoAutoControllo>(this.documenti);
        this.documentiDataSource.paginator = this.documentiPaginator;
      },
      (err) => {
        console.log("Error loading documents", err);
        this.messageService.showMessageError("Errore nel caricamento Documenti Controllo Tamponi");
      }
    );
  }

  async showDocument(documento: DocumentoAutoControllo) {

    const path = `cucinaAutoControllo/${documento._id}`;

    this.uploadService
      .download(documento.filename, undefined, path)
      .then((x) => {
        console.log("download: ", x);
        x.subscribe((data) => {
          console.log("download: ", data);
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = window.navigator as any;
          if (window.navigator && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
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




  AddDocument() {
    this.addingDocument = true;
    this.nuovoDocumento = new DocumentoAutoControllo();
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

  saveDocumento(doc: DocumentoAutoControllo) {
    if (doc.file == undefined) {
      this.messageService.showMessageError("Selezionare un file");
      return;
    }

    const path = "cucinaAutoControllo";
    const file: File = doc.file;
    this.uploadingDocumento = true;

    console.log("Invio documento: ", doc);
    this.cucinaService
        .addDocumentoAutoControllo(doc)
        .subscribe(
          (result: DocumentoAutoControllo) => {
            console.log(result);

            let formData: FormData = new FormData();

            const nameDocument: string = doc.filename;

            formData.append("file", file);
            formData.append("path", `${path}/${result._id}`);
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
          });
  }

  deleteDocument(documento: DocumentoAutoControllo) {
    this.messageService.deleteMessageQuestion("Vuoi cancellare il documento ?")
        .subscribe( success => {
          if (success == true) {
            this.cucinaService
                .deleteDocumentoAutoControllo(documento)
                .subscribe(
                  x => {
                    const index = this.documenti.indexOf(documento);
                    console.log("Documento cancellato index: ", index);
                    if (index > -1) {
                      this.documenti.splice(index, 1);
                    }
                    this.documentiDataSource.data = this.documenti;
                  },
                  (err) => {
                    this.messageService.showMessageError("Errore nella cancellazione");
                    console.error(err);
                  }
                );
          } else {
            this.messageService.showMessageError("Cancellazione Documento annullata");
          }
        },
        err=> {
          console.log("Error ", err);
          this.messageService.showMessageError("Cancellazione Documento annullata");
        })
  }


}
