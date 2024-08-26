import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoControlloTamponi } from 'src/app/models/DocumentoControlloTamponi';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-cucina-controllo-tamponi',
  templateUrl: './cucina-controllo-tamponi.component.html',
  styleUrls: ['./cucina-controllo-tamponi.component.css']
})
export class CucinaControlloTamponiComponent implements OnInit {

  addingDocument: boolean = false;
  nuovoDocumento: DocumentoControlloTamponi;
  uploadingDocumento: boolean = false;

  documenti: DocumentoControlloTamponi[];
  public documentiDataSource: MatTableDataSource<DocumentoControlloTamponi>;
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
    .getDocumentiControlloTamponi()
    .subscribe(
      (result: DocumentoControlloTamponi[]) => {
        console.log("Loaded document: ", result);
        this.documenti = result || [];

        this.documentiDataSource = new MatTableDataSource<DocumentoControlloTamponi>(this.documenti);
        this.documentiDataSource.paginator = this.documentiPaginator;
      },
      (err) => {
        console.log("Error loading documents", err);
        this.messageService.showMessageError("Errore nel caricamento Documenti Controllo Tamponi");
      }
    );
  }

  async showDocument(documento: DocumentoControlloTamponi) {

    const path = `cucinaControlliTamponi/${documento._id}`;

    this.uploadService
      .download(documento.filename, undefined, path)
      .then((x) => {
        
        x.subscribe((data) => {
          
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
    this.nuovoDocumento = new DocumentoControlloTamponi();
  }


  uploadDocumento($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoDocumento.filename = file.name;
      this.nuovoDocumento.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  saveDocumento(doc: DocumentoControlloTamponi) {
    if (doc.file == undefined) {
      this.messageService.showMessageError("Selezionare un file");
      return;
    }

    const path = "cucinaControlliTamponi";
    const file: File = doc.file;
    this.uploadingDocumento = true;

    console.log("Invio documento: ", doc);
    this.cucinaService
        .addDocumentControlloTamponi(doc)
        .subscribe(
          (result: DocumentoControlloTamponi) => {
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

  deleteDocument(documento: DocumentoControlloTamponi) {
    this.messageService.deleteMessageQuestion("Vuoi cancellare il documento ?")
        .subscribe( success => {
          if (success == true) {
            this.cucinaService
                .deleteDocumentoControlloTamponi(documento)
                .subscribe(
                  x => {
                    const index = this.documenti.indexOf(documento);
                    
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
          
          this.messageService.showMessageError("Cancellazione Documento annullata");
        })
  }

}
