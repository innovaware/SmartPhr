import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { DialogFarmaciPazienteComponent } from "src/app/dialogs/dialog-farmaci-paziente/dialog-farmaci-paziente.component";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DialogPresidiPazienteComponent } from "src/app/dialogs/dialog-presidi-paziente/dialog-presidi-paziente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { ArmadioFarmaci } from "../../models/armadioFarmaci";
import { ArmadioFarmaciService } from "../../service/armadioFarmaci.service";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "../../service/attivitafarmacipresidi.service";

@Component({
  selector: 'app-gest-farmacipresidi-pazienti',
  templateUrl: './gest-farmacipresidi-pazienti.component.html',
  styleUrls: ['./gest-farmacipresidi-pazienti.component.css']
})
export class GestFarmacipresidiPazientiComponent implements OnInit {

  pazienti: Paziente[];
  displayedColumns: string[] = [
    "nome",
    "cognome",
    "codiceFiscale",
    "dataNascita",
    "action",
  ];

  dataSourceR: MatTableDataSource<AttivitaFarmaciPresidi>;
  public attivita: AttivitaFarmaciPresidi[];
  DisplayedColumnsN: string[] = ["elemento", "elementotype", "operazione", "quantita","res", "date", "operatore", "ospite"];
  dataSource: MatTableDataSource<Paziente>;
  @ViewChild("paginatorPazienti", { static: false }) paginator: MatPaginator;
  @ViewChild("Registro", { static: false }) paginatorR: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService,
    public aF: ArmadioFarmaciService,
    private AFPS: AttivitafarmacipresidiService
  ) {
    this.pazienti = [];
    this.dataSource = new MatTableDataSource<Paziente>();

    this.loadPazienti();

    this.getAttivita();
    console.log("Pazienti Constructor");
  }

  ngOnInit() {
  
  }

  ngAfterViewInit() {
  
  }

  async loadPazienti() {
    try {
      const res: Paziente[] = await this.pazienteService.getPazienti();
      const pazientiConFarmaci = await Promise.all(
        res.map(async (x) => {
          const afres: ArmadioFarmaci[] = await this.aF.get();
          const hasFarmaci = afres.some(y => y.pazienteId === x._id);
          return hasFarmaci ? x : null;
        })
      );

      // Filtra i pazienti non nulli
      this.pazienti = pazientiConFarmaci.filter(x => x !== null);
      this.dataSource.data = this.pazienti;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error("Errore durante il caricamento dei pazienti", error);
    }
  }

  async view(row: Paziente) {
    let armF: ArmadioFarmaci;

    try {
      const res = await this.aF.getByPaziente(row._id);
      armF = res[0];

      const dialogRef = this.dialog.open(DialogFarmaciPazienteComponent, {
        data: {
          paziente: row,
          armadioFarmaci: armF
        },
        width: '100%',          // Larghezza del 80% dello schermo
        maxWidth: '800px',      // Massima larghezza di 600px
        minWidth: '600px',      // Minima larghezza di 300px
      });

      if (dialogRef) {
        dialogRef.afterClosed().subscribe((result) => {
          this.loadPazienti();

          this.getAttivita();
        });
      }
    } catch (error) {
      console.error('Error fetching armadio farmaci', error);
    }

    this.loadPazienti();
  }


  getAttivita() {
    this.attivita = [];
    this.dataSourceR = new MatTableDataSource<AttivitaFarmaciPresidi>();
        this.AFPS.getAllAttivitaArmadiFP().then((result: AttivitaFarmaciPresidi[]) => {
          this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
          this.dataSourceR.data = this.attivita;
          this.dataSourceR.paginator = this.paginatorR;
        });
  }

  applyFilter(event: Event, t: String) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (t == "ospiti")
      this.dataSource.filter = filterValue.trim().toLowerCase();
    if (t == "registro")
      this.dataSourceR.filter = filterValue.trim().toLowerCase();
  }
}
