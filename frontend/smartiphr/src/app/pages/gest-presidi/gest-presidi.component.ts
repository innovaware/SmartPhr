import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogPresidioComponent } from "src/app/dialogs/dialog-presidio/dialog-presidio.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Presidi } from "src/app/models/presidi";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestPresidiService } from "src/app/service/gest-presidi.service";
import { MessagesService } from "src/app/service/messages.service";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "../../service/attivitafarmacipresidi.service";
import { Settings } from "../../models/settings";
import { SettingsService } from "../../service/settings.service";
@Component({
  selector: 'app-gest-presidi',
  templateUrl: './gest-presidi.component.html',
  styleUrls: ['./gest-presidi.component.css']
})
export class GestPresidiComponent implements OnInit {

  DisplayedColumnsN: string[] = ["elemento", "operazione", "quantita", "date", "operatore"];
  displayedColumns: string[] = [
    "nome",
  //  "descrizione",
    "qtyTot",
    "qty",
    "disponibile",
    "occupate",
    //"giacenza",
    "taglia",
    "action",
  ];
  dataSource: MatTableDataSource<Presidi>;
  dataSourceR: MatTableDataSource<AttivitaFarmaciPresidi>;
  dataSourceS: MatTableDataSource<Presidi>;
  presidi: Presidi[];
  presidiScad: Presidi[];
  public attivita: AttivitaFarmaciPresidi[];
  settings: Settings;

  @ViewChild("presidi", { static: false }) paginator: MatPaginator;
  @ViewChild("scaduti", { static: false }) paginatorS: MatPaginator;
  @ViewChild("Registro", { static: false }) paginatorR: MatPaginator;

  dipendente: Dipendenti = {} as Dipendenti;
  constructor(
    public dialog: MatDialog,
    public presidiService: GestPresidiService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    private settServ: SettingsService,
    public AFPS: AttivitafarmacipresidiService
  ) {
    this.presidi = [];
    this.presidiScad = [];
    this.dataSource = new MatTableDataSource<Presidi>();
    this.dataSourceS = new MatTableDataSource<Presidi>();
    this.presidiService.getPresidi().then((result) => {
      this.presidi = result.filter(x => new Date(x.scadenza) > new Date() || x.scadenza == undefined );
      this.presidiScad = result.filter(x => new Date(x.scadenza) <= new Date());

      this.dataSource = new MatTableDataSource<Presidi>(this.presidi);
      this.dataSourceS = new MatTableDataSource<Presidi>(this.presidiScad);
      this.dataSource.paginator = this.paginator;
      this.dataSourceS.paginator = this.paginatorS;

      this.settings = new Settings();
      this.settServ.getSettings().then((res) => {
        this.settings = res[0];
        let farmListName: string = "";
        let numScad: number = 0;

        console.log("settings:", this.settings);
        console.log("presidi:", this.presidi);

        this.presidi.forEach(x => {
          numScad = this.dateDiff(new Date(), new Date(x.scadenza));
          if (numScad <= this.settings.alertFarmaci.valueOf()) {
            if (numScad < 1) {
              farmListName += `Il presidio ${x.nome} è scaduto\n`;
            } else {
              farmListName += `Il presidio ${x.nome} scadrà tra ${numScad} ${numScad === 1 ? 'giorno' : 'giorni'}\n`;
            }
          }
        });

        if (farmListName !== "") {
          this.messageService.showMessage(farmListName);
        }
      });
    });
    
    this.getAttivita();
  }

  ngOnInit(): void {
    this.loadUser();

    this.getAttivita();
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user.dipendenteID)
        .then((x) => {

          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }

  dateDiff(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }


  ngAfterViewInit() {
    this.presidiService.getPresidi().then((result) => {
      this.presidi = result.filter(x => new Date(x.scadenza) > new Date() || x.scadenza == undefined);
      this.presidiScad = result.filter(x => new Date(x.scadenza) <= new Date());

      this.dataSource = new MatTableDataSource<Presidi>(this.presidi);
      this.dataSourceS = new MatTableDataSource<Presidi>(this.presidiScad);
      this.dataSource.paginator = this.paginator;
      this.dataSourceS.paginator = this.paginatorS;
    });
  }

  applyFilter(event: Event,t:String) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(t=="presidi")
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (t == "scaduti")
      this.dataSourceS.filter = filterValue.trim().toLowerCase();
    if (t == "registro")
      this.dataSourceR.filter = filterValue.trim().toLowerCase();
  }


  async newItem() {
    // Apro il dialog e assegno direttamente la reference
    const dialogRef = this.dialog.open(DialogPresidioComponent, {
      data: { row: new Presidi(), title: 'Nuovo Presidio' },
    });

    // Se il dialogRef è valido, procedo con l'ascolto della chiusura del dialogo
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log("The dialog was closed");

        // Verifica se il risultato è valido (non undefined o null) e se è vero
        if (result) {
          result.operator = this.dipendente._id;
          result.operatorName = `${this.dipendente.nome} ${this.dipendente.cognome}`;

          try {
            // Inserisco il nuovo presidio
            const insertResult = await this.presidiService.insert(result);
            console.log("Update Completed. Result: ", insertResult);


            // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
            const af: AttivitaFarmaciPresidi = {
              dataOP: new Date(),
              elemento: result.nome,
              elemento_id: result._id,
              operation: "Inserimento Presidio",
              type: "Presidi",
              qty: result.qtyTot.toString(),
              operator: this.dipendente._id,
              operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            };

            // Inserimento dell'attività
            await this.AFPS.addPres(af);

            // Aggiungo il nuovo presidio alla lista e aggiorno la tabella
            this.presidi.push(result);
            this.dataSource.data = this.presidi;
          } catch (err) {
            console.error("Error inserting presidio: ", err);
          }
        }

        // Ricarico la lista dei presidi e aggiorno la dataSource
        try {
          this.presidiService.getPresidi().then((result) => {
            this.presidi = result.filter(x => new Date(x.scadenza) > new Date() || x.scadenza == undefined);
            this.presidiScad = result.filter(x => new Date(x.scadenza) <= new Date());

            this.dataSource = new MatTableDataSource<Presidi>(this.presidi);
            this.dataSourceS = new MatTableDataSource<Presidi>(this.presidiScad);
            this.dataSource.paginator = this.paginator;
            this.dataSourceS.paginator = this.paginatorS;

            this.getAttivita();
          });
        } catch (err) {
          console.error("Error fetching presidi: ", err);
        }
      });
    }
  }


  async editItem(item: Presidi) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogPresidioComponent, {
      data: { row: Presidi.clone(item), title: 'Modifica Presidio', readOnly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log("The dialog was closed");
        if (result != undefined && result) {

          result.operator = this.dipendente._id;
          result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;


          if (item.qtyTot > result.qtyTot) {
            // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
            const af: AttivitaFarmaciPresidi = {
              dataOP: new Date(),
              elemento: result.nome,
              elemento_id: result._id,
              operation: "Scarico Presidio",
              type: "Presidi",
              qty: (item.qtyTot - result.qtyTot).toString(),
              operator: this.dipendente._id,
              operatorName: this.dipendente.nome + ' ' + this.dipendente.cognome,
            };
            // Inserimento dell'attività
            await this.AFPS.addPres(af);
          }
          else {
            if (item.qtyTot < result.qtyTot) {
              // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: result.nome,
                elemento_id: result._id,
                operation: "Carico Presidio",
                type: "Presidi",
                qty: (item.qtyTot + result.qtyTot).toString(),
                operator: this.dipendente._id,
                operatorName: this.dipendente.nome + ' ' + this.dipendente.cognome,
              };
              // Inserimento dell'attività
              await this.AFPS.addPres(af);
            }
            else {
              // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: result.nome,
                elemento_id: result._id,
                operation: "Modifica dati Presidio",
                type: "Presidi",
                qty: "",
                operator: this.dipendente._id,
                operatorName: this.dipendente.nome + ' ' + this.dipendente.cognome,
              };
              // Inserimento dell'attività
              await this.AFPS.addPres(af);
            }
          }


          this.presidiService
            .update(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);

              const index = this.presidi.indexOf(item, 0);
              if (index > -1) {
                this.presidi.splice(index, 1);
                console.log("Removed item");
              }

              this.presidi.push(result);
              this.dataSource.data = this.presidi;

              this.getAttivita();
            })
            .catch((err) => {
              console.error("Error update presidio: ", err);
            });
        }
      });
    this.getAttivita();
  }

  view(row: Presidi) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogPresidioComponent, {
      data: { row: Presidi.clone(row), title: 'Modifica Presidio', readOnly: true },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
      });
  }

  getAttivita() {

    this.attivita = [];
    this.dataSourceR = new MatTableDataSource<AttivitaFarmaciPresidi>();
    this.AFPS.getAllAttivitaPresidi()
      .then((result: AttivitaFarmaciPresidi[]) => {
        // Ordinamento delle attività per data
        this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());

        // Imposta la sorgente dati con l'array ordinato
        this.dataSourceR.data = this.attivita;

        // Configura il paginatore
        this.dataSourceR.paginator = this.paginatorR;
      })
      .catch(error => {
        console.error('Errore durante il recupero delle attività:', error);
      });
  }

}
