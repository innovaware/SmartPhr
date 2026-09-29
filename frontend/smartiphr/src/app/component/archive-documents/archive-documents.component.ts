import { Component, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
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
export class ArchiveDocumentsComponent implements OnInit, AfterViewInit {
  @Input() typeDocument: string;
  displayedColumns: string[] = ["filename", "dateupload", "firstname", "lastname", "codicefiscale", "typeDocument", "action"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public documentiPazienteDataSource = new MatTableDataSource<{
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }>();

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public patientService: PazienteService,
    public uploadService: UploadService
  ) { }

  ngOnInit() {
    this.documentiPazienteDataSource.filterPredicate = this.createFilter();
    this.loadData();
  }

  ngAfterViewInit() {
    // Collegamento tassativo del paginator per evitare il problema "0 of 0"
    this.documentiPazienteDataSource.paginator = this.paginator;
  }

  loadData() {
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
        // Creiamo una lista di Promise per recuperare tutti i pazienti in parallelo
        const promises = f.map((visita) => {
          if (visita.paziente) {
            return this.patientService
              .getPaziente(visita.paziente)
              .then((patient: Paziente) => ({
                documentoPaziente: visita,
                paziente: patient[0],
              })
            )
              .catch((err) => {
                console.error("Errore recupero paziente:", err);
                return {
                  documentoPaziente: visita,
                  paziente: {} as Paziente,
                };
              });
          } else {
            return Promise.resolve({
              documentoPaziente: visita,
              paziente: {} as Paziente,
            });
          }
        });
        console.log(promises);
        // Una volta risolte tutte le promise, aggiorniamo la mat-table in un unico blocco
        Promise.all(promises).then((items) => {
          console.log(items);
          this.documentiPazienteDataSource.data = items;
        });
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.documentiPazienteDataSource.filter = filterValue.trim().toLowerCase();

    if (this.documentiPazienteDataSource.paginator) {
      this.documentiPazienteDataSource.paginator.firstPage();
    }
  }

  createFilter() {
    let filterFunction = function (
      data: { documentoPaziente: DocumentoPaziente; paziente: Paziente },
      filter: string
    ): boolean {
      let searchTerms = filter.toLowerCase();

      const codiceFiscale: string = (data.paziente?.codiceFiscale || "").toLowerCase();
      const cognome: string = (data.paziente?.cognome || "").toLowerCase();
      const nome: string = (data.paziente?.nome || "").toLowerCase();
      const contenuto: string = (data.documentoPaziente?.filename || "").toLowerCase();
      const dateupload: string = moment(data.documentoPaziente?.dateupload)
        .utc()
        .format("DD-MM-YYYY");

      return (
        contenuto.includes(searchTerms) ||
        dateupload.includes(searchTerms) ||
        cognome.includes(searchTerms) ||
        nome.includes(searchTerms) ||
        codiceFiscale.includes(searchTerms)
      );
    };
    return filterFunction;
  }

  show(doc: {
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }) {
    this.uploadService
      .download(doc.documentoPaziente.filename, doc.documentoPaziente.paziente, this.typeDocument)
      .then((x) => {
        x.subscribe(
          (data) => {
            const newBlob = new Blob([data as BlobPart], {
              type: "application/pdf",
            });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
            }
            const downloadURL = URL.createObjectURL(newBlob);
            window.open(downloadURL);
          },
          (err) => {
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
