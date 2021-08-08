import { Component, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Diario } from 'src/app/models/diario';
import { Paziente } from "src/app/models/paziente";

@Component({
  selector: 'app-table-ospiti',
  templateUrl: './table-ospiti.component.html',
  styleUrls: ['./table-ospiti.component.css']
})
export class TableOspitiComponent implements OnInit {
  @Output() showItemEmiter = new EventEmitter<Paziente>();

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];
  dataSource: MatTableDataSource<Paziente>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {
    var diario: Diario = {
      data: new Date(),
      firma: "firma",
      valore: "valore"
    };

    var ELEMENT_DATA: Paziente[] = [
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

          diario: [diario]
          // diario: [
          //   { data: new Date(), valore: 'diario1', firma: ''},
          //   { data: new Date(), valore: 'diario2', firma: 'firma2'},
          //   { data: new Date(), valore: 'diario3', firma: ''}
          // ]
        }
      },
    ];

    this.dataSource = new MatTableDataSource<Paziente>(ELEMENT_DATA);

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showPaziente(paziente: Paziente) {
    this.showItemEmiter.emit(paziente);
  }

}
