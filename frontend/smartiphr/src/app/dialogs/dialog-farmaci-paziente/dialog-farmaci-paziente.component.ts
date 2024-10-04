import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Farmaci } from "src/app/models/farmaci";
import { Paziente } from "src/app/models/paziente";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestFarmaciService } from "src/app/service/gest-farmaci.service";
import { MessagesService } from "src/app/service/messages.service";
import { DialogFarmacoPazienteComponent } from "../dialog-farmaco-paziente/dialog-farmaco-paziente.component";
import { Presidi } from "../../models/presidi";
import { ArmadioFarmaci } from "../../models/armadioFarmaci";
import { ArmadioFarmaciService } from "../../service/armadioFarmaci.service";
import { DialogQuestionComponent } from "../dialog-question/dialog-question.component";
import { GestPresidiService } from "../../service/gest-presidi.service";
import { FarmacoArmadio, PresidioArmadio } from "../../models/armadioFarmaciPresidi";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "../../service/attivitafarmacipresidi.service";
import { Dipendenti } from "../../models/dipendenti";
@Component({
  selector: 'app-dialog-farmaci-paziente',
  templateUrl: './dialog-farmaci-paziente.component.html',
  styleUrls: ['./dialog-farmaci-paziente.component.css']
})
export class DialogFarmaciPazienteComponent implements OnInit, AfterViewInit {
  displayedColumnsF: string[] = [
    "nome",
    "quantita",
    // "confezione",
    "scadenza",
    "Note",
    "action",
  ];
  displayedColumnsP: string[] = [
    "nome",
    "quantita",
    // "confezione",
    "scadenza",
    "Note",
    "action",
  ];

  DisplayedColumnsN: string[] = ["elemento", "elementotype", "operazione", "quantita","res", "date", "operatore"];
  @ViewChild("paginatorFarmaci", { static: false }) paginatorF: MatPaginator;
  @ViewChild("paginatorPresidi", { static: false }) paginatorP: MatPaginator;
  @ViewChild("Registro", { static: false }) paginatorR: MatPaginator;

  dataSourceR: MatTableDataSource<AttivitaFarmaciPresidi>;
  public attivita: AttivitaFarmaciPresidi[];
  dataSourceF: MatTableDataSource<FarmacoArmadio> = new MatTableDataSource<FarmacoArmadio>();
  dataSourceP: MatTableDataSource<PresidioArmadio> = new MatTableDataSource<PresidioArmadio>();
  farmaci: FarmacoArmadio[] = [];
  presidi: PresidioArmadio[] = [];
  dipendente: Dipendenti;

  constructor(
    public dialog: MatDialog,
    public farmaciService: GestFarmaciService,
    public presServ: GestPresidiService,
    public dipendenteService: DipendentiService,
    public aF: ArmadioFarmaciService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    private AFPS: AttivitafarmacipresidiService,
    @Inject(MAT_DIALOG_DATA) public data: {
      paziente: Paziente,
      armadioFarmaci: ArmadioFarmaci
    }
  ) { }

  ngOnInit() {
    // Non assegnare i paginator qui, fallo in ngAfterViewInit
    this.farmaci = this.data.armadioFarmaci.farmaci;
    this.presidi = this.data.armadioFarmaci.presidi;
    this.dataSourceF.data = this.farmaci;
    this.dataSourceP.data = this.presidi;
    this.loadUser();
    this.getAttivita();
  }

  ngAfterViewInit() {
    // Assegna i paginator correttamente qui
    this.dataSourceF.paginator = this.paginatorF;
    this.dataSourceP.paginator = this.paginatorP;
    this.loadUser();
    this.getAttivita();
  }

  async newItem(type: String) {
    let dialogRef;

    if (type === "farmaci") {
      dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
        data: {
          type: "farmaco",
          armadioFarmaci: this.data.armadioFarmaci,
          paziente: this.data.paziente,
        },
      });
    } else if (type === "presidi") {
      dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
        data: {
          type: "presidio",
          armadioFarmaci: this.data.armadioFarmaci,
          paziente: this.data.paziente,
        },
      });
    }

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) { // Verifica che il salvataggio sia stato completato con successo
          console.log("Il dialog è stato chiuso, salvataggio riuscito:", result);

          // Chiedi i dati aggiornati
          const res = await this.aF.getByPaziente(this.data.paziente._id);

          // Aggiorna i dati nel dataSource
          this.dataSourceF.data = res[0].farmaci;
          this.dataSourceP.data = res[0].presidi;

          // Riassegna i paginator
          this.dataSourceF.paginator = this.paginatorF;
          this.dataSourceP.paginator = this.paginatorP;

          // Aggiorna i dati nell'oggetto armadioFarmaci
          this.data.armadioFarmaci.farmaci = res[0].farmaci;
          this.data.armadioFarmaci.presidi = res[0].presidi;

          this.getAttivita();
          console.log("Dati aggiornati dopo il salvataggio.");
        }
      });
    }
  }

  loadUser() {
    this.dipendente = new Dipendenti();
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
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
  edit(row: any, type: String) {
    let dialogRef;

    if (type === "farmaci") {
      dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
        data: {
          type: "farmaco",
          armadioFarmaci: this.data.armadioFarmaci,
          editMode: true,
          materiale: row,
          id: row.farmacoID,
          paziente: this.data.paziente,
        },
      });
    } else if (type === "presidi") {
      dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
        data: {
          type: "presidio",
          armadioFarmaci: this.data.armadioFarmaci,
          editMode: true,
          materiale: row,
          id: row.presidioID,
          paziente: this.data.paziente,
        },
      });
    }

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) { // Verifica che il salvataggio sia stato completato con successo
          console.log("Il dialog è stato chiuso, salvataggio riuscito:", result);

          const res = await this.aF.getByPaziente(this.data.paziente._id);

          // Aggiorna i dati nel dataSource
          this.dataSourceF.data = res[0].farmaci;
          this.dataSourceP.data = res[0].presidi;

          // Riassegna i paginator
          this.dataSourceF.paginator = this.paginatorF;
          this.dataSourceP.paginator = this.paginatorP;

          // Aggiorna i dati nell'oggetto armadioFarmaci
          this.data.armadioFarmaci.farmaci = res[0].farmaci;
          this.data.armadioFarmaci.presidi = res[0].presidi;

          this.getAttivita();
          console.log("Dati aggiornati dopo il salvataggio.");
        }
      });
    }
  }

  async delete(row: any, type: string) {
    if (!row) {
      this.messageService.showMessageError("Cancellazione annullata");
      return;
    }

    const dialogData = {
      data: { message: type === "farmaci" ? "Cancellare il farmaco?" : "Cancellare il presidio?" }
    };

    const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

    if (!result) {
      console.log(`Cancellazione ${type} annullata`);
      this.messageService.showMessageError(`Cancellazione ${type} annullata`);
      return;
    }

    try {
      if (type === "farmaci") {
        const index = this.farmaci.indexOf(row);
        if (index > -1) {
          this.farmaci.splice(index, 1);
          console.log(this.farmaci);
          this.data.armadioFarmaci.farmaci = this.farmaci;
          this.dataSourceF.data = this.farmaci;
          this.dataSourceF.paginator = this.paginatorF;

          console.log("Dati per PUT (Farmaci):", this.data.armadioFarmaci);
          const response = await this.aF.update(this.data.armadioFarmaci, "").toPromise();
          console.log("Risposta PUT (Farmaci):", response);

          let f = await this.farmaciService.getById(row.farmacoID);
          f.quantitaDisponibile = Number(f.quantitaDisponibile) + Number(row.quantita);
          f.quantitaOccupata = Number(f.quantitaOccupata) - Number(row.quantita);

          await this.farmaciService.update(f);

          const af: AttivitaFarmaciPresidi = {
            dataOP: new Date(),
            elemento: row.nome,
            elemento_id: row.FarmacoID,
            operation: "Eliminato",
            type: "ArmadioFarmaci",
            elementotype: "Farmaci",
            qty: "",
            operator: this.dipendente._id,
            operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            paziente: this.data.paziente._id,
            pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
          };

          await this.AFPS.addArmF(af);
          this.getAttivita();
        }
      } else {
        const index = this.presidi.indexOf(row);
        if (index > -1) {
          this.presidi.splice(index, 1);
          this.data.armadioFarmaci.presidi = this.presidi;
          this.dataSourceP.data = this.presidi;
          this.dataSourceP.paginator = this.paginatorP;

          console.log("Dati per PUT (Presidi):", this.data.armadioFarmaci);
          const response = await this.aF.update(this.data.armadioFarmaci, "").toPromise();
          console.log("Risposta PUT (Presidi):", response);

          let p = await this.presServ.getById(row.presidioID);
          p.quantitaDisponibile = Number(p.quantitaDisponibile) + Number(row.quantita);
          p.quantitaOccupata = Number(p.quantitaOccupata) - Number(row.quantita);

          await this.presServ.update(p);

          const af: AttivitaFarmaciPresidi = {
            dataOP: new Date(),
            elemento: row.nome,
            elemento_id: row.PresidioID,
            operation: "Eliminato",
            type: "ArmadioFarmaci",
            elementotype: "Presidi",
            qty: "",
            operator: this.dipendente._id,
            operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            paziente: this.data.paziente._id,
            pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
          };

          await this.AFPS.addArmF(af);
          this.getAttivita();
        }
      }
    } catch (error) {
      console.error(`Errore durante la cancellazione: ${error}`);
      this.messageService.showMessageError(`Errore durante la cancellazione: ${error}`);
    }
  }

  

  applyFilter(event: Event, type: String) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (type == "farmaci") {
      this.dataSourceF.filter = filterValue;
    }
    if (type == "presidi") {
      this.dataSourceP.filter = filterValue;
    }
    if (type == "registro")
      this.dataSourceR.filter = filterValue.trim().toLowerCase();
  }

  getAttivita() {
    this.attivita = [];
    this.dataSourceR = new MatTableDataSource<AttivitaFarmaciPresidi>();
    this.AFPS.getAttivitaArmadiFPByPaziente(this.data.paziente._id).then((result: AttivitaFarmaciPresidi[]) => {
      this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
      this.dataSourceR.data = this.attivita;
      this.dataSourceR.paginator = this.paginatorR;
    });
  }

}

