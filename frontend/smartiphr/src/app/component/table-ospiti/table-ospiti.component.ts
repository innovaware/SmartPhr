import { Component, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Diario } from 'src/app/models/diario';
import { Paziente } from "src/app/models/paziente";
import { PazienteService } from 'src/app/service/paziente.service';

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

  constructor(
    public dialog: MatDialog,
    public pazienteService: PazienteService
    ) {

    this.pazienteService.getPazienti().then( (result)=>{
      let pazienti: Paziente[] = result;

      this.dataSource = new MatTableDataSource<Paziente>(pazienti);
    });
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
