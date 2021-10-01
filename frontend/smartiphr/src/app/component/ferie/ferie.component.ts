import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Ferie } from "src/app/models/ferie";
import {FerieService } from "src/app/service/ferie.service";

@Component({
  selector: 'app-ferie',
  templateUrl: './ferie.component.html',
  styleUrls: ['./ferie.component.css']
})
export class FerieComponent implements OnInit {

  @Output() showItemEmiter = new EventEmitter<{
    ferie: Ferie;
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



  dataSource: MatTableDataSource<Ferie>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public ferie: Ferie[];

  constructor(
    public dialog: MatDialog,
    public ferieService: FerieService
  ) {
    this.ferieService.getFerie().then((result) => {
      this.ferie = result;

      this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
      this.dataSource.paginator = this.paginator;
    });

}



ngOnInit() {}

  ngAfterViewInit() {}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(ferie: Ferie, item: string) {
    this.showItemEmiter.emit({ ferie: ferie, button: item });


  }


}
