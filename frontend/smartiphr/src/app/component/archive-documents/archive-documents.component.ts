import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { map } from "rxjs/operators";
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-archive-documents',
  templateUrl: './archive-documents.component.html',
  styleUrls: ['./archive-documents.component.css']
})
export class ArchiveDocumentsComponent implements OnInit {
  @Input() typeDocument: string;
  displayedColumns: string[] = ["filename", "dateupload", "firstname",  "lastname", "codicefiscale", "typeDocument", "action"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  documentiPazientePaginator: MatPaginator;
  public documentiPazienteDataSource: MatTableDataSource<{
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }>;
  public documentiPaziente: {
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }[] = [];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public patientService: PazienteService,
    public uploadService: UploadService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.documentiPazienteDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  ngOnInit() {
    this.documentiPaziente = [];
    this.documentiPazienteDataSource = new MatTableDataSource<{
      documentoPaziente: DocumentoPaziente;
      paziente: Paziente;
    }>(this.documentiPaziente);
    this.documentiPazienteDataSource.filterPredicate = this.createFilter();

    console.log("Get docs");

    this.patientService
      .getDocumentByType(this.typeDocument)
      .pipe(
        map((results) =>
          results.sort((a, b) =>
            moment(b.dateupload).diff(moment(a.dateupload))
          )
        )
      )
      .subscribe((f: DocumentoPaziente[]) => {
        f.forEach((visita) => {
          if (visita.paziente != undefined) {
            this.patientService
              .getPaziente(visita.paziente)
              .then((patient: Paziente) => {
                this.documentiPaziente.push({
                  documentoPaziente: visita,
                  paziente: patient,
                });

                this.documentiPazienteDataSource.data = this.documentiPaziente;
                this.documentiPazienteDataSource.paginator = this.documentiPazientePaginator;
              });
          }
        });
      });
  }

  createFilter() {
    let filterFunction = function (
      data: { documentoPaziente: DocumentoPaziente; paziente: Paziente },
      filter: string
    ): boolean {
      let searchTerms = filter;

      let nameSearch = () => {
        const codiceFiscale: string = data.paziente.codiceFiscale || "";
        const cognome: string = data.paziente.cognome || "";
        const nome: string = data.paziente.nome || "";
        const contenuto: string = data.documentoPaziente.filename || "";
        const dateupload: string = moment(data.documentoPaziente.dateupload)
          .utc()
          .format("DD-MM-YYYY");


        const found: boolean =
          contenuto.includes(searchTerms) ||
          dateupload.includes(searchTerms) ||
          cognome.includes(searchTerms) ||
          nome.includes(searchTerms) ||
          codiceFiscale.includes(searchTerms);

        return found;
      };
      return nameSearch();
    };
    return filterFunction;
  }

  show(doc: {
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }) {
    this.uploadService
      .download(doc.documentoPaziente.filename, doc.paziente._id, this.typeDocument)
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
        },
        err=> {
          this.messageService.showMessageError("Errore file non trovato");
          console.error(err);
        }
        );
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }
}
