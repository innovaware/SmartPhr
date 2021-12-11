import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { map } from "rxjs/operators";
import { DialogVisitespecialisticheComponent } from "src/app/dialogs/dialog-visitespecialistiche/dialog-visitespecialistiche.component";
import { Paziente } from "src/app/models/paziente";
import { VisiteSpecialistiche } from "src/app/models/visiteSpecialistiche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-archivi-visite-specialistiche",
  templateUrl: "./archivi-visite-specialistiche.component.html",
  styleUrls: ["./archivi-visite-specialistiche.component.css"],
})
export class ArchiviVisiteSpecialisticheComponent implements OnInit {
  displayedColumns: string[] = ["dataEsec", "dataReq", "user", "action"];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  visiteSpecialistichePaginator: MatPaginator;
  public visiteSpecialisticheDataSource: MatTableDataSource<{
    visitaSpecialistica: VisiteSpecialistiche;
    paziente: Paziente;
  }>;
  public visiteSpecialistiche: {
    visitaSpecialistica: VisiteSpecialistiche;
    paziente: Paziente;
  }[] = [];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public patientService: PazienteService,
    public cartellaclinicaService: CartellaclinicaService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.visiteSpecialisticheDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  ngOnInit() {
    this.visiteSpecialistiche = [];
    this.visiteSpecialisticheDataSource = new MatTableDataSource<{
      visitaSpecialistica: VisiteSpecialistiche;
      paziente: Paziente;
    }>(this.visiteSpecialistiche);
    this.visiteSpecialisticheDataSource.filterPredicate = this.createFilter();

    this.cartellaclinicaService
      .getVisiteSpecialistiche()
      .pipe(
        map((results) =>
          results.sort((a, b) => moment(b.dataEsec).diff(moment(a.dataEsec)))
        )
      )
      .subscribe((f: VisiteSpecialistiche[]) => {
        f.forEach((visita) => {
          if (visita.user != undefined) {
            this.patientService
              .getPaziente(visita.user)
              .then((patient: Paziente) => {
                this.visiteSpecialistiche.push({
                  visitaSpecialistica: visita,
                  paziente: patient,
                });

                this.visiteSpecialisticheDataSource.data = this.visiteSpecialistiche;
                this.visiteSpecialisticheDataSource.paginator = this.visiteSpecialistichePaginator;
              });
          }
        });
      });
  }

  createFilter() {
    let filterFunction = function (data: { visitaSpecialistica: VisiteSpecialistiche;  paziente: Paziente;}, filter: string): boolean {
      let searchTerms = filter;

      let nameSearch = () => {
        const codiceFiscale: string = data.paziente.codiceFiscale || '';
        const cognome: string = data.paziente.cognome || '';
        const nome: string = data.paziente.nome || '';
        const contenuto: string = data.visitaSpecialistica.contenuto || '';
        const dataEsec: string = moment(data.visitaSpecialistica.dataEsec).utc().format('DD-MM-YYYY');
        const dataReq: string = moment(data.visitaSpecialistica.dataReq).utc().format('DD-MM-YYYY');

        const found: boolean =
          contenuto.includes(searchTerms) ||
          dataEsec.includes(searchTerms) ||
          dataReq.includes(searchTerms) ||
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
    visitaSpecialistica: VisiteSpecialistiche;
    paziente: Paziente;
  }) {
    var dialogRef = this.dialog.open(DialogVisitespecialisticheComponent, {
      data: {
        visitaSpecialistica: visita.visitaSpecialistica,
        readonly: true,
      },
      width: "600px",
    });
  }
}
