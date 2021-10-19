import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Dipendenti } from "src/app/models/dipendenti";
import { Permessi } from "src/app/models/permessi";
import {PermessiService } from "src/app/service/permessi.service";


@Component({
  selector: 'app-permessi',
  templateUrl: './permessi.component.html',
  styleUrls: ['./permessi.component.css']
})
export class PermessiComponent implements OnInit {


  @Input() data: Dipendenti;
  @Input() disable: boolean;

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
  ) {}


loadTable(){
  if(this.data){

    this.permessiService.getPermessiByDipendente(this.data._id).then((result) => {
      this.permessi = result;

      this.dataSource = new MatTableDataSource<Permessi>(this.permessi);
      this.dataSource.paginator = this.paginator;
    });
  }
  else{
  this.permessiService.getPermessi().then((result) => {
    this.permessi = result;

    this.dataSource = new MatTableDataSource<Permessi>(this.permessi);
    this.dataSource.paginator = this.paginator;
  });
  }
}


ngOnInit() {
  this.loadTable();
}

  ngAfterViewInit() {}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(permessi: Permessi, item: string) {
    this.showItemEmiter.emit({ permessi: permessi, button: item });
  }





  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
  }


  async updatePermesso(permesso: Permessi) {

    this.permessiService
    .updatePermesso(permesso)
    .then((result: Permessi) => {
      const index = this.permessi.indexOf(permesso);
      permesso.closed = true;
      this.permessi[index] = permesso;

      this.dataSource.data = this.permessi;
    })
    .catch((err) => {
      this.showMessageError("Errore modifica stato Permessi");
      console.error(err);
    });
  }


  sendResp(row){
    let fId = row._id;
    let status = row.accettata;
    let message = 'Sei sicuro di voler respingere questa richiesta?';
    if(status)
      message = 'Sei sicuro di voler accettare questa richiesta?';


    let result = window.confirm(message);
    if(result){
        this.updatePermesso(row);
    }

  }



}
