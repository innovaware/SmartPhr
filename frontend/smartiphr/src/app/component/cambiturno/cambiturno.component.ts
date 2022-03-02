import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { Cambiturno } from "src/app/models/cambiturni";
import { Dipendenti } from "src/app/models/dipendenti";
import {CambiturniService } from "src/app/service/cambiturni.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-cambiturno',
  templateUrl: './cambiturno.component.html',
  styleUrls: ['./cambiturno.component.css']
})
export class CambiturnoComponent implements OnInit {

  @Input() data: Dipendenti;
  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    cambiturno: Cambiturno;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataInizioVT",
    "dataFineVT",
    "dataInizioNT",
    "dataFineNT",
    "dataRichiesta",
    "cf",
    "motivazione",
    "accettata",
    "action",
  ];



  dataSource: MatTableDataSource<Cambiturno>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public cambiturno: Cambiturno[];


  dipendente: Dipendenti = {} as Dipendenti;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public cambiturniService: CambiturniService,
    public dipendenteService: DipendentiService
  ) {
    this.cambiturniService.getCambiturno().then((result) => {
      this.cambiturno = result;

      this.dataSource = new MatTableDataSource<Cambiturno>(this.cambiturno);
      this.dataSource.paginator = this.paginator;
    });

}

loadTable(){
  if(this.isExternal != true){
    if(this.data){

      this.cambiturniService.getCambiturnoByDipendente(this.data._id).then((result) => {
        this.cambiturno = result;

        this.dataSource = new MatTableDataSource<Cambiturno>(this.cambiturno);
        this.dataSource.paginator = this.paginator;
      });
    }
    else{
    this.cambiturniService.getCambiturno().then((result) => {
      this.cambiturno = result;

      this.dataSource = new MatTableDataSource<Cambiturno>(this.cambiturno);
      this.dataSource.paginator = this.paginator;
    });
    }
  }
  else{
    this.loadUser();
  }
}


loadUser(){
  this.dipendenteService
  .getById('620027d56c8df442a73341fa')
  .then((x) => {
        this.dipendente = x;
        this.cambiturniService.getCambiturnoByDipendente(this.dipendente._id).then((result) => {
          this.cambiturno = result;
  
          this.dataSource = new MatTableDataSource<Cambiturno>(this.cambiturno);
          this.dataSource.paginator = this.paginator;
        });
  })
  .catch((err) => {
    this.messageService.showMessageError(
      "Errore Caricamento dipendente (" + err["status"] + ")"
    );
  });
}




  ngOnInit() {
    this.loadTable();
  }

  ngAfterViewInit() {}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(cambiturno: Cambiturno, item: string) {
    this.showItemEmiter.emit({ cambiturno: cambiturno, button: item });
  }



  async updateCambioturno(cambio: Cambiturno) {

    this.cambiturniService
    .updateCambioturno(cambio)
    .then((result: Cambiturno) => {
      const index = this.cambiturno.indexOf(cambio);
      cambio.closed = true;
      this.cambiturno[index] = cambio;
      this.dataSource.data = this.cambiturno;
    })
    .catch((err) => {
      this.messageService.showMessageError("Errore modifica stato Cambiturno");
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
        this.updateCambioturno(row);
    }

  }



}
