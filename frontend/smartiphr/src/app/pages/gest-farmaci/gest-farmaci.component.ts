import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
//import { Console } from "console";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Farmaci } from "src/app/models/farmaci";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestFarmaciService } from "src/app/service/gest-farmaci.service";
import { MessagesService } from "src/app/service/messages.service";
import { Paziente } from "../../models/paziente";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "../../service/attivitafarmacipresidi.service";

@Component({
  selector: 'app-gest-farmaci',
  templateUrl: './gest-farmaci.component.html',
  styleUrls: ['./gest-farmaci.component.css']
})
export class GestFarmaciComponent implements OnInit {
  type: String;
  paziente: Paziente;
  ospite: Boolean;
  DisplayedColumnsN: string[] = ["elemento", "operazione", "quantita", "date", "operatore"];
  displayedColumns: string[] = [
    "nome",
    // "descrizione",
    // "formulazione",
    "formato",
    "lotto",
    "qtyTot",
    // "qty",
    "disponibile",
    "occupate",
    //"giacenza",
    "scadenza",
    //  "classe",
    "action",
  ];
  dataSource: MatTableDataSource<Farmaci>;
  dataSourceR: MatTableDataSource<AttivitaFarmaciPresidi>;
  dataSourceS: MatTableDataSource<Farmaci>;
  farmaci: Farmaci[];
  farmaciScad: Farmaci[];
  public attivita: AttivitaFarmaciPresidi[];
  @ViewChild("Farmaci", { static: false }) paginator: MatPaginator;
  @ViewChild("Scaduti", { static: false }) paginatorS: MatPaginator;
  @ViewChild("Registro", { static: false }) paginatorR: MatPaginator;

  dipendente: Dipendenti ;
  OperatorID: String;
  Operator: String;
  constructor(
    public dialog: MatDialog,
    public farmaciService: GestFarmaciService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    public AFPS: AttivitafarmacipresidiService
  ) {
    this.type = "Farmaci";
    this.paziente = new Paziente();
    this.ospite = false;
    this.farmaci = [];
    this.farmaciScad = [];
    this.dataSource = new MatTableDataSource<Farmaci>();
    this.dataSourceS = new MatTableDataSource<Farmaci>();
    this.farmaciService.getFarmaci().then((result) => {
      console.log(result); // Log per verificare il contenuto di result

      this.farmaci = result.filter(x => new Date(x.scadenza) < new Date());
      this.farmaciScad = result.filter(x => new Date(x.scadenza) >= new Date());

      this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
      this.dataSourceS = new MatTableDataSource<Farmaci>(this.farmaciScad);

      // Assicurati che i paginator siano stati inizializzati
      this.dataSourceS.paginator = this.paginatorS;
      this.dataSource.paginator = this.paginator;
    });
    this.dipendente = new Dipendenti();
    this.getAttivita();
    this.loadUser();
  }

  ngOnInit(): void {
    this.dipendente = new Dipendenti();
    this.loadUser();

  }

  ngAfterViewInit() {
    this.dipendente = new Dipendenti();
    this.loadUser();
    this.farmaciService.getFarmaci().then((result) => {
      console.log(result); // Log per verificare il contenuto di result

      this.farmaci = result.filter(x => new Date(x.scadenza) >= new Date());
      this.farmaciScad = result.filter(x => new Date(x.scadenza) < new Date());

      this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
      this.dataSourceS = new MatTableDataSource<Farmaci>(this.farmaciScad);

      // Assicurati che i paginator siano stati inizializzati
      this.dataSourceS.paginator = this.paginatorS;
      this.dataSource.paginator = this.paginator;
    });
    this.getAttivita();
  }



  applyFilter(event: Event, t: String) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (t == "farmaci")
      this.dataSource.filter = filterValue.trim().toLowerCase();
    if (t == "scaduti")
      this.dataSourceS.filter = filterValue.trim().toLowerCase();
    if (t == "registro")
      this.dataSourceR.filter = filterValue.trim().toLowerCase();
  }




  loadUser() {

    this.dipendente = new Dipendenti();
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

    this.Operator = this.dipendente.nome + " " + this.dipendente.cognome;
    this.OperatorID = this.dipendente._id;
  }




  async newItem() {
    const dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: { row: new Farmaci(), title: 'Nuovo Farmaco' },
    });

    // Attende la chiusura della finestra di dialogo
    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      result.operator = this.OperatorID;
      result.operatorName = this.Operator;

      try {
        const insertResult = await this.farmaciService.insert(result);
        console.log("Update Completed. Result: ", insertResult);
        this.farmaci.push(result);

        // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
        const af: AttivitaFarmaciPresidi = {
          dataOP: new Date(),
          elemento: result.nome,
          elemento_id: result._id,
          operation: "Inserimento Farmaco",
          type: "Farmaci",
          qty: result.qtyTot.toString(),
          operator: this.dipendente._id,
          operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
        };

        // Inserimento dell'attività
        await this.AFPS.addFarm(af);

        // Aggiornamento dei farmaci
        const farmaciResult = await this.farmaciService.getFarmaci();
        console.log(farmaciResult); // Log per verificare il contenuto di result

        // Filtraggio dei farmaci per scadenza
        this.farmaci = farmaciResult.filter((x) => new Date(x.scadenza) >= new Date());
        this.farmaciScad = farmaciResult.filter((x) => new Date(x.scadenza) < new Date());

        // Aggiornamento delle dataSource per la visualizzazione nelle tabelle
        this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
        this.dataSourceS = new MatTableDataSource<Farmaci>(this.farmaciScad);

        // Impostazione dei paginator (assicurandosi che siano già stati inizializzati)
        this.dataSource.paginator = this.paginator;
        this.dataSourceS.paginator = this.paginatorS;

        this.getAttivita();
      } catch (err) {
        console.error("Error during farmaco insertion or update: ", err);
      }
    }
  }


  async editItem(item: Farmaci) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: { row: Farmaci.clone(item), title: 'Modifica Farmaco', readOnly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log("The dialog was closed");
        if (result != undefined && result) {
          /* result.operator = this.dipendente._id;
           result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;*/

          if (item.qtyTot > result.qtyTot) {
            // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
            const af: AttivitaFarmaciPresidi = {
              dataOP: new Date(),
              elemento: result.nome,
              elemento_id: result._id,
              operation: "Scarico Farmaco",
              type: "Farmaci",
              qty: (item.qtyTot - result.qtyTot).toString(),
              operator: this.dipendente._id,
              operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            };
            // Inserimento dell'attività
            await this.AFPS.addFarm(af);
          }
          else {
            if (item.qtyTot < result.qtyTot) {
              // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: result.nome,
                elemento_id: result._id,
                operation: "Carico Farmaco",
                type: "Farmaci",
                qty: (item.qtyTot + result.qtyTot).toString(),
                operator: this.dipendente._id,
                operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
              };
              // Inserimento dell'attività
              await this.AFPS.addFarm(af);
            }
            else {
              // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: result.nome,
                elemento_id: result._id,
                operation: "Modifica dati Farmaco",
                type: "Farmaci",
                qty:"",
                operator: this.dipendente._id,
                operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
              };
              // Inserimento dell'attività
              await this.AFPS.addFarm(af);
            }
          }


          result.operator = this.OperatorID
          result.operatorName = this.Operator;
          this.farmaciService
            .update(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);

              const index = this.farmaci.indexOf(item, 0);
              if (index > -1) {
                this.farmaci.splice(index, 1);
                console.log("Removed item");
              }

              this.farmaci.push(result);
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
          this.farmaciService.getFarmaci().then((result) => {
            console.log(result); // Log per verificare il contenuto di result

            this.farmaci = result.filter(x => new Date(x.scadenza) >= new Date());
            this.farmaciScad = result.filter(x => new Date(x.scadenza) < new Date());

            this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
            this.dataSourceS = new MatTableDataSource<Farmaci>(this.farmaciScad);

            // Assicurati che i paginator siano stati inizializzati
            this.dataSourceS.paginator = this.paginatorS;
            this.dataSource.paginator = this.paginator;

            this.getAttivita();
          });
        }
      });
  }

  view(row: Farmaci) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: { row: Farmaci.clone(row), title: 'Modifica Farmaco', readOnly: true },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
      });
  }


  getAttivita() {

    this.attivita = [];
    this.dataSourceR = new MatTableDataSource<AttivitaFarmaciPresidi>();
    this.AFPS.getAllAttivitaFarmaci()
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
