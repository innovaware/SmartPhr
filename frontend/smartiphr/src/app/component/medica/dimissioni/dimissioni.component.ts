import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { schedaDimissioneOspite } from 'src/app/models/schedaDimissioneOspite';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from 'src/app/models/paziente';
import { DocumentipazientiService } from 'src/app/service/documentipazienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';


@Component({
  selector: 'app-dimissioni',
  templateUrl: './dimissioni.component.html',
  styleUrls: ['./dimissioni.component.css']
})
export class DimissioniComponent implements OnInit {

  @Input() data: schedaDimissioneOspite;
  @Input() paziente: Paziente;

  DisplayedColumns: string[] = ["namefile", "date", "action"];

  @ViewChild("paginatorDocsDimissione",{static: false})
  DocsDimissionePaginator: MatPaginator;
  public nuovoDocDimissione: DocumentoPaziente;
  public DocsDimissioneDataSource: MatTableDataSource<DocumentoPaziente>;
  public docsDimissione: DocumentoPaziente[];
  public uploadingDocDimissione: boolean;
  public addingDocDimissione: boolean;

  constructor(
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    ) { }

  ngOnInit() {
    this.getDocsDimissione();
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




  async addDocDimissione() {
    this.addingDocDimissione = true;
    this.nuovoDocDimissione = {
      paziente: this.paziente._id,
      filename: undefined,
      note: "",
      type: "Dimissione",
    };
  }

  async uploadDocDimissione($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload DocDimissione: ", $event);
      this.nuovoDocDimissione.filename = file.name;
      this.nuovoDocDimissione.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocDimissione(doc: DocumentoPaziente,i) {

    const index = i;
    console.log("Cancella DocDimissione index: ", index);
    this.docService
      .remove(doc)
      .then((x) => {
        console.log("DocDimissione cancellato");
        if (index > -1) {
          this.docsDimissione.splice(index, 1);
        }

        this.DocsDimissioneDataSource.data = this.docsDimissione;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc Dimissione"
        );
        console.error(err);
      });
  }

  async saveDocDimissione(doc: DocumentoPaziente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Dimissione";
    const path = "Dimissione";
    const file: File = doc.file;
    this.uploadingDocDimissione = true;

    console.log("Invio DocDimissione: ", doc);
    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert DocDimissione: ", result);
        this.docsDimissione.push(result);
        this.DocsDimissioneDataSource.data = this.docsDimissione;
        this.addingDocDimissione = false;
        this.uploadingDocDimissione = false;

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
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getDocsDimissione() {
    console.log(`get DocsDimissione paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "Dimissione")
      .then((f: DocumentoPaziente[]) => {
        this.docsDimissione = f;

        this.DocsDimissioneDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.docsDimissione
        );
        this.DocsDimissioneDataSource.paginator = this.DocsDimissionePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsDimissione"
        );
        console.error(err);
      });
  }


}
