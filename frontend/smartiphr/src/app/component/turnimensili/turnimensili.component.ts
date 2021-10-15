import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Dipendenti } from "src/app/models/dipendenti";
import { Turnimensili } from "src/app/models/turnimensili";
import {TurnimensiliService } from "src/app/service/turnimensili.service";
@Component({
  selector: 'app-turnimensili',
  templateUrl: './turnimensili.component.html',
  styleUrls: ['./turnimensili.component.css']
})
export class TurnimensiliComponent implements OnInit {

  @Input() data: Dipendenti;
  @Input() disable: boolean;
  
  @Output() showItemEmiter = new EventEmitter<{
    turnimensili: Turnimensili;
    button: string;
  }>();


  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "cf",
    "turno"
  ];



  dataSource: MatTableDataSource<Turnimensili>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public turnimensili: Turnimensili[];

  constructor(
    public dialog: MatDialog,
    public turnimensiliService: TurnimensiliService
  ) {}



ngOnInit() {
  if(this.data){

    this.turnimensiliService.getTurnimensiliByDipendente(this.data._id).then((result) => {
      this.turnimensili = result;

      this.dataSource = new MatTableDataSource<Turnimensili>(this.turnimensili);
      this.dataSource.paginator = this.paginator;
    });
  }
  else{
  this.turnimensiliService.getTurnimensili().then((result) => {
    this.turnimensili = result;

    this.dataSource = new MatTableDataSource<Turnimensili>(this.turnimensili);
    this.dataSource.paginator = this.paginator;
  });
  } 
}

  ngAfterViewInit() {}




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(turnimensili: Turnimensili, item: string) {
    this.showItemEmiter.emit({ turnimensili : turnimensili, button: item });
  }

}
