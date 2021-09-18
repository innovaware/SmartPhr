import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { Paziente } from "src/app/models/paziente";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-table-ospiti",
  templateUrl: "./table-ospiti.component.html",
  styleUrls: ["./table-ospiti.component.css"],
})
export class TableOspitiComponent implements OnInit {
  @Output() showItemEmiter = new EventEmitter<{
    paziente: Paziente;
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
  dataSource: MatTableDataSource<Paziente>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public pazienti: Paziente[];

  constructor(
    public dialog: MatDialog,
    public pazienteService: PazienteService
  ) {
    this.pazienteService.getPazienti().then((result) => {
      this.pazienti = result;

      this.dataSource = new MatTableDataSource<Paziente>(this.pazienti);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(paziente: Paziente, item: string) {
    this.showItemEmiter.emit({ paziente: paziente, button: item });


  }

  insert() {
    console.log("Insert");
    let paziente: Paziente = {
      cognome: "",
      nome: "",
      sesso: "",
      luogoNascita: "",
      dataNascita: undefined,
      residenza: "",
      statoCivile: "",
      figli: 0,
      scolarita: "",
      situazioneLavorativa: "",
      personeRiferimento: "",
      telefono: "",
      dataIngresso: new Date(),
      provincia: "",
      localita: "",
      comuneNascita: "",
      provinciaNascita: "",
      cartellaClinica: [],
    };

    const dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: true, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert paziente", result);
      if (result != undefined) {
        this.pazienteService
          .insert(result)
          .then((x) => {
            let data = this.dataSource.data;
            data.push(result);
            this.dataSource.data = data;
          })
          .catch((err) => {
            this.showMessageError("Errore Inserimento Paziente (" + err['status'] + ")");
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
