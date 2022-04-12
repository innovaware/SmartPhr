import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";

@Component({
  selector: 'app-table-document',
  templateUrl: './table-document.component.html',
  styleUrls: ['./table-document.component.css']
})
export class TableDocumentComponent implements OnInit {
  showInsert: boolean;    //TODO
  dataSource: any;        //TODO
  buttons: any;           //TODO

  displayedColumns: string[] = [
    "action",
    "cognome",
    "nome",
    "dataNascita"
  ];

  constructor() { }

  ngOnInit() {
  }

  insert() {
    //TODO
  }

  applyFilter(param) {
    //TODO
  }

  call(row, item) {
    //TODO
  }
}
