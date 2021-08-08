import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogPisicologicaComponent } from "src/app/dialogs/dialog-pisicologica/dialog-pisicologica.component";
import { Paziente } from "src/app/models/paziente";

@Component({
  selector: "app-pisicologica",
  templateUrl: "./pisicologica.component.html",
  styleUrls: ["./pisicologica.component.css"],
})
export class PisicologicaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];
  dataSource = new MatTableDataSource<Paziente>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  show(paziente: Paziente) {
    const dialogRef = this.dialog.open(DialogPisicologicaComponent, {
      data: paziente
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      //  this.animal = result;
    });
  }
}

const ELEMENT_DATA: Paziente[] = [
  {
    cognome: "Test",
    nome: "Test",
    sesso: "F",
    luogoNascita: "Catania",
    dataNascita: new Date("01-01-1980"),
    residenza: "via prova",
    statoCivile: "Sposata",
    figli: 2,
    scolarita: "Media",
    situazioneLavorativa: "Disoccupata",
    personeRiferimento: "Nessuno",
    telefono: "12345667895",
    dataIngresso: new Date(),
    provincia: "CT",
    localita: "Melfi",

    schedaPisico: {
      esame: {
        statoEmotivo: ["ansioso"],
        personalita: ["apatia"],
        linguaggio: ["fluente"],
        memoria: ["difficolta_rec"],
        orientamento: ["dis_temporale"],
        abilitaPercettivo: ["difficoltà_lett_scritt"],
        abilitaEsecutive: ["inflessibilita"],
        ideazione: ["allucinazioni"],
        umore: ["euforico"],

        partecipazioni: "noadeguata",
        ansia: "Presente",
        testEsecutivi: "Si"
      },

      valutazione: "Ciao",

      diario: [
        { data: new Date(), valore: 'diario1', firma: ''},
        { data: new Date(), valore: 'diario2', firma: 'firma2'},
        { data: new Date(), valore: 'diario3', firma: ''}
      ]
    }



  },
];
