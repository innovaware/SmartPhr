import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";

@Component({
  selector: 'app-table-dipendenti',
  templateUrl: './table-dipendenti.component.html',
  styleUrls: ['./table-dipendenti.component.css']
})
export class TableDipendentiComponent implements OnInit {


  @Output() showItemEmiter = new EventEmitter<{
    dipendente: Dipendenti;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];


  dataSource: MatTableDataSource<Dipendenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public dipendenti: Dipendenti[];

  constructor(
    public dialog: MatDialog,
    public dipendentiService: DipendentiService
  ) {
    this.dipendentiService.get().then((result) => {
      this.dipendenti = result;

      this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
      this.dataSource.paginator = this.paginator;
    });

}



ngOnInit() {}

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(dipendente: Dipendenti, item: string) {
    this.showItemEmiter.emit({ dipendente: dipendente, button: item });


  }



  insert() {
    console.log("Insert");
    let dipendente: Dipendenti = {
      cognome: "",
      nome: "",
      cf: "",
      indirizzoNascita: "",
      comuneNascita: "",
      provinciaNascita: "",
      dataNascita: undefined,
      indirizzoResidenza: "",
      residenza: "",
      luogoResidenza: "",
      provinciaResidenza: "",
      titoloStudio: "",
      mansione: "",
      contratto: "",
      email: "",
      telefono: "",

      user: "",
      group: ""
    };

    const dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: true, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert dipendente", result);
      if (result !== false) {
        this.dipendentiService
          .insert(result)
          .then((x) => {
            let data = this.dataSource.data;
            data.push(result);
            this.dataSource.data = data;
          })
          .catch((err) => {
            this.showMessageError("Errore Inserimento Dipendente (" + err['status'] + ")");
          });
      }
    });
  }


  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: 'custom-modalbox',
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);

      });
  }

}
