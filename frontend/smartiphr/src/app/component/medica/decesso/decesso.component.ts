import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from 'src/app/models/paziente';
import { schedaDecessoOspite } from 'src/app/models/schedaDecessoOspite';
import { DocumentipazientiService } from 'src/app/service/documentipazienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-decesso',
  templateUrl: './decesso.component.html',
  styleUrls: ['./decesso.component.css']
})
export class DecessoComponent implements OnInit {

  @Input() data: schedaDecessoOspite;
  @Input() paziente: Paziente;

  DisplayedColumns: string[] = ["namefile", "date", "action"];

  @ViewChild("paginatorDocsDecesso",{static: false})
  DocsDecessoPaginator: MatPaginator;
  public nuovoDocDecesso: DocumentoPaziente;
  public DocsDecessoDataSource: MatTableDataSource<DocumentoPaziente>;
  public docsDecesso: DocumentoPaziente[];
  public uploadingDocDecesso: boolean;
  public addingDocDecesso: boolean;


  constructor(
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    ) { }

  ngOnInit() {
    this.getDocsDecesso();
  }

  async showDocument(doc: DocumentoPaziente) {
    console.log("doc: ", JSON.stringify(doc));
    this.uploadService
      .download(doc.filename, doc.paziente, doc.type)
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




  async addDocDecesso() {
    this.addingDocDecesso = true;
    this.nuovoDocDecesso = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Decesso",
    };
  }

  async uploadDocDecesso($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload DocDecesso: ", $event);
      this.nuovoDocDecesso.filename = file.name;
      this.nuovoDocDecesso.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocDecesso(doc: DocumentoPaziente,i) {

    const index = i;
    console.log("Cancella DocDecesso index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("DocDecesso cancellato");
        if (index > -1) {
          this.docsDecesso.splice(index, 1);
        }

        this.DocsDecessoDataSource.data = this.docsDecesso;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc decesso"
        );
        console.error(err);
      });
  }

  async saveDocDecesso(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Decesso";
    const path = "Decesso";
    const file: File = doc.file;
    this.uploadingDocDecesso = true;

    console.log("Invio DocDecesso: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert DocDecesso: ", result);
        this.docsDecesso.push(result);
        this.DocsDecessoDataSource.data = this.docsDecesso;
        this.addingDocDecesso = false;
        this.uploadingDocDecesso = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento file");
        console.error(err);
      });
  }

  async getDocsDecesso() {
    console.log(`get DocsDecesso paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "Decesso")
      .then((f: DocumentoPaziente[]) => {
        this.docsDecesso = f;
        console.log('get DocsDecesso lista: ' + JSON.stringify(f));
        this.DocsDecessoDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.docsDecesso
        );
        this.DocsDecessoDataSource.paginator = this.DocsDecessoPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsDecesso"
        );
        console.error(err);
      });
  }


}
