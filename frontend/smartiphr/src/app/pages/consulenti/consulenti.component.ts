import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogConsulenteComponent } from "src/app/dialogs/dialog-consulente/dialog-consulente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Consulenti } from "src/app/models/consulenti";
import { ConsulentiService } from "src/app/service/consulenti.service";
import { MessagesService } from 'src/app/service/messages.service';
import { Settings } from "../../models/settings";
import { SettingsService } from "../../service/settings.service";
import { ContrattoService } from "../../service/contratto.service";

@Component({
  selector: "app-consulenti",
  templateUrl: "./consulenti.component.html",
  styleUrls: ["./consulenti.component.css"],
})
export class ConsulentiComponent implements OnInit {
  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "dataNascita",
    "indirizzoNascita",
    "comuneNascita",
    "provinciaNascita",
    "action",
  ];

  dataSource: MatTableDataSource<Consulenti>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  data: Consulenti[];
  settings: Settings;


  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public consulentiService: ConsulentiService,
    private contrServ: ContrattoService,
    private settServ: SettingsService,
  ) {
    this.data = [];
    this.settings = new Settings();
    settServ.getSettings().then((res) => { this.settings = res[0] });
  }

  dateDiff(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.settings = new Settings();
    this.settServ.getSettings().then((res) => {
      this.settings = res[0];
      console.log("Settings:", this.settings); // Punto di debug

      var mess = "";
      this.consulentiService.getConsulenti().then((result) => {
        console.log("Consulenti:", result); // Punto di debug

        const contrattoPromises = result.map((x) => {
          return this.contrServ.getContratto(x._id).then((res) => {
            console.log(`Contratti per ${x.cognome} ${x.nome}:`, res); // Punto di debug

            res = res.filter(y => new Date(y.dataScadenza) > new Date());
            console.log(`Contratti validi per ${x.cognome} ${x.nome}:`, res); // Punto di debug

            const cont = res.length > 0 ? res[0] : undefined;
            if (cont != undefined) {
              const numScad = this.dateDiff(new Date(), new Date(cont.dataScadenza));
              console.log(`Giorni alla scadenza per ${x.cognome} ${x.nome}:`, numScad); // Punto di debug

              if (numScad < this.settings.alertContratto.valueOf()) {
                mess += `Mancano ${numScad} giorni alla scadenza del contratto di: ${x.cognome} ${x.nome}\n`;
                console.log("Mess aggiornato:", mess); // Punto di debug
              }
            }
          });
        });

        Promise.all(contrattoPromises).then(() => {
          if (mess != "") {
            console.log("Mostra messaggio:", mess); // Punto di debug
            this.messageService.showMessage(mess);
          }
          this.data = result;
          this.dataSource = new MatTableDataSource<Consulenti>(this.data);
          this.dataSource.paginator = this.paginator;
        });
      });
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var consulente: Consulenti = new Consulenti();

    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: {
        consulente: consulente,
        isNew: true,
        readonly: false,
      },
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();  // This ensures the dialog closes on backdrop click
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.data.push(result);
          this.dataSource.data = this.data;
          console.log("Inserito consulente", result);
        }
      });
  }

  async show(consulente: Consulenti) {
    console.log("Show scheda consulente:", consulente);
    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: { consulente: consulente, readonly: false },
      width: "1024px",
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();  // This ensures the dialog closes on backdrop click
    });
  }

  async deleteConsulente(consulente: Consulenti) {
    console.log("Cancella consulente:", consulente);

    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il consulente?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.consulentiService
            .delete(consulente)
            .subscribe((result: Consulenti) => {
              console.log("Eliminazione eseguita con successo", result);
              const index = this.data.indexOf(consulente, 0);
              if (index > -1) {
                this.data.splice(index, 1);
              }
              this.dataSource = new MatTableDataSource<Consulenti>(this.data);
              this.dataSource.paginator = this.paginator;
            }),
            (err) => {
              console.error("Errore nell'eliminazione", err);
            };
        } else {
          console.log("Cancellazione consulente annullata");
          this.messageService.showMessageError("Cancellazione consulente Annullata");
        }
      });
  }
}
