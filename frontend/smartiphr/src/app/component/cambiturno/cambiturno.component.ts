import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { Cambiturno } from "src/app/models/cambiturni";
import { Dipendenti } from "src/app/models/dipendenti";
import { CambiturniService } from "src/app/service/cambiturni.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-cambiturno",
  templateUrl: "./cambiturno.component.html",
  styleUrls: ["./cambiturno.component.css"],
})
export class CambiturnoComponent implements OnInit, OnChanges {
  @Input() data: Cambiturno[];
  @Input() dipendente: Dipendenti;
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

<<<<<<< HEAD


=======
  dataSource: MatTableDataSource<Cambiturno>;
>>>>>>> 3e06403 (Ottimiz. e fix dipendente page)

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public nuovoCambio: Cambiturno;
  dataSource: MatTableDataSource<Cambiturno>;
  public cambiturno: Cambiturno[];
  public uploadingCambiturno: boolean;
  public addingCambiturno: boolean;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public cambiturniService: CambiturniService,
    public dipendenteService: DipendentiService
  ) {
  }

  ngOnChanges(changes) {
    this.dataSource = new MatTableDataSource<Cambiturno>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // this.loadTable();
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
        this.messageService.showMessageError(
          "Errore modifica stato Cambiturno"
        );
        console.error(err);
      });
  }

  sendResp(row) {
    let fId = row._id;
    let status = row.accettata;
    let message = "Sei sicuro di voler respingere questa richiesta?";
    if (status) message = "Sei sicuro di voler accettare questa richiesta?";

    let result = window.confirm(message);
    if (result) {
      this.updateCambioturno(row);
    }
  }
}
