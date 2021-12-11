import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Dipendenti } from "src/app/models/dipendenti";
import { Ferie } from "src/app/models/ferie";
import {FerieService } from "src/app/service/ferie.service";
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-ferie',
  templateUrl: './ferie.component.html',
  styleUrls: ['./ferie.component.css']
})
export class FerieComponent implements OnInit {

  @Input() data: Dipendenti;
  @Input() disable: boolean;

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
    public messageService: MessagesService,
    public ferieService: FerieService
  ) {}



loadTable(){
  if(this.data){

    this.ferieService.getFerieByDipendente(this.data._id).then((result) => {
      this.ferie = result;

      this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
      this.dataSource.paginator = this.paginator;
    });
  }
  else{
  this.ferieService.getFerie().then((result) => {
    this.ferie = result;

    this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
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

  call(ferie: Ferie, item: string) {
    this.showItemEmiter.emit({ ferie: ferie, button: item });


  }

  async updateFerie(ferie: Ferie) {

    this.ferieService
    .updateFerie(ferie)
    .then((result: Ferie) => {

      const index = this.ferie.indexOf(ferie);
      ferie.closed = true;
      this.ferie[index] = ferie;

      this.dataSource.data = this.ferie;

    })
    .catch((err) => {
      this.messageService.showMessageError("Errore modifica stato ferie");
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
        this.updateFerie(row);

    }

  }

}
