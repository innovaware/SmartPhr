import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Permessi } from "src/app/models/permessi";
import {PermessiService } from "src/app/service/permessi.service";


@Component({
  selector: 'app-permessi',
  templateUrl: './permessi.component.html',
  styleUrls: ['./permessi.component.css']
})
export class PermessiComponent implements OnInit {

  @Output() showItemEmiter = new EventEmitter<{
    permessi: Permessi;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "cf",
    "accettata",
    "action",
  ];






  dataSource: MatTableDataSource<Permessi>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public permessi: Permessi[];

  constructor(
    public dialog: MatDialog,
    public permessiService: PermessiService
  ) {
    this.permessiService.getPermessi().then((result) => {
      this.permessi = result;

      this.dataSource = new MatTableDataSource<Permessi>(this.permessi);
      this.dataSource.paginator = this.paginator;
    });

}



ngOnInit() {}

  ngAfterViewInit() {}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(permessi: Permessi, item: string) {
    this.showItemEmiter.emit({ permessi: permessi, button: item });


  }


}
