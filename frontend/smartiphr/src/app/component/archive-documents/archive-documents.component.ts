import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { map } from "rxjs/operators";
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: 'app-archive-documents',
  templateUrl: './archive-documents.component.html',
  styleUrls: ['./archive-documents.component.css']
})
export class ArchiveDocumentsComponent implements OnInit {
  @Input() typeDocument: string;
  displayedColumns: string[] = ["filename", "dateupload", "user", "action"];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
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

  show(visita: {
    documentoPaziente: DocumentoPaziente;
    paziente: Paziente;
  }) {

  }
}
