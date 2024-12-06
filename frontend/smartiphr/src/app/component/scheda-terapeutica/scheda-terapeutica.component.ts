import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PazienteService } from "src/app/service/paziente.service";
import { SchedaTerapeuticaService } from "../../service/schedaTerapeutica.service";
import { ItemsArray, ItemsArrayAlvo, ItemsArrayFirme, SchedaTerapeutica } from "../../models/schedaTerapeutica";
import { Paziente } from "../../models/paziente";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { MatDialog } from '@angular/material/dialog';
import { DialogSchedaTerapeuticaComponent } from "../../dialogs/dialog-schedaTerapeutica/dialog-schedaTerapeutica.component";
import { SettingsService } from "../../service/settings.service";
import { Settings } from "../../models/settings";
import { DipendentiService } from "../../service/dipendenti.service";
import { AuthenticationService } from "../../service/authentication.service";
import { Dipendenti } from "../../models/dipendenti";
import { User } from "../../models/user";
import { MessagesService } from "../../service/messages.service";
import * as moment from "moment";
import { Subscription, interval } from "rxjs";
import { Router, NavigationStart } from "@angular/router";
import { DialogQuestionComponent } from "../../dialogs/dialog-question/dialog-question.component";


@Component({
  selector: "app-scheda-terapeutica",
  templateUrl: "./scheda-terapeutica.component.html",
  styleUrls: ["./scheda-terapeutica.component.css"],
})

export class SchedaTerapeuticaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() id: string; //Id paziente
  @Input() inLettura: boolean;

  element = {
    allergie: '',
    note: ''
  };
  currentDate: moment.Moment;
  maxDate: string;
  disable: boolean = true;
  paziente: Paziente;
  dipendente: Dipendenti;
  user: User;
  DisplayedColumns: string[] = ["dataInizio", "terapiaOrale", "fasceOrarie", "dataFine", "note", "action"];
  DisplayedColumns2: string[] = ["data", "numeroAlviNormali", "numeroAlviDiarroici", "action"];
  displayedColumns: string[] = ["data", "firmaMattina", "firmaPomeriggio", "firmaNotte"];
  public dataSourceOrale: MatTableDataSource<ItemsArray>;
  public dataSourceIMEVSC: MatTableDataSource<ItemsArray>;
  public dataSourceEstemporanea: MatTableDataSource<ItemsArray>;
  public dataSourceFirme: MatTableDataSource<ItemsArrayFirme>;
  public dataSourceAlvo: MatTableDataSource<ItemsArrayAlvo>;
  public orali: ItemsArray[];
  public IMEVSC: ItemsArray[];
  public Estemporanea: ItemsArray[];
  public firme: ItemsArrayFirme[];
  public alvo: ItemsArrayAlvo[];
  public allergie: string;
  private scheda: SchedaTerapeutica;
  private settings: Settings;
  public tm: Boolean;
  public tp: Boolean;
  public tn: Boolean;

  private timerSubscription!: Subscription;
  private alreadyExecuted: boolean = false;

  @ViewChild("paginatorOrale", { static: false }) paginatorO: MatPaginator;
  @ViewChild("paginatorImevsc", { static: false }) paginatorI: MatPaginator;
  @ViewChild("paginatorEstemporanea", { static: false }) paginatorE: MatPaginator;
  @ViewChild("paginatorFirme", { static: false }) paginatorF: MatPaginator;
  @ViewChild("paginatorAlvo", { static: false }) paginatorA: MatPaginator;
  constructor(
    public dialog: MatDialog,
    public pazienteService: PazienteService,
    public setServ: SettingsService,
    private dipendenteService: DipendentiService,
    private authenticationService: AuthenticationService,
    public messageService: MessagesService,
    private schedaServ: SchedaTerapeuticaService
  ) {
    this.scheda = new SchedaTerapeutica();
    this.paziente = new Paziente();
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.dataSourceFirme = new MatTableDataSource<ItemsArrayFirme>();
    this.dataSourceAlvo = new MatTableDataSource<ItemsArrayAlvo>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.firme = [];
    this.alvo = [];
    this.allergie = "";
    this.settings = new Settings();

    pazienteService.getPaziente(this.id).then((x: Paziente) => {
      this.paziente = x[0];
    });

    setServ.getSettings().then((x: Settings) => {
      this.settings = x[0];
    });
    this.tm = false;
    this.tp = false;
    this.tn = false;
    this.getDati();
    this.loadUser();

  }

  ngOnInit() {

    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.dataSourceFirme = new MatTableDataSource<ItemsArrayFirme>();
    this.dataSourceAlvo = new MatTableDataSource<ItemsArrayAlvo>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.firme = [];
    this.alvo = [];
    this.allergie = "";
    this.getDati();
    this.startCheckingTime(); // Avvia il controllo all'accesso

  }

  ngOnDestroy(): void {
    this.stopCheckingTime();
  }

  ngOnChanges() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.dataSourceFirme = new MatTableDataSource<ItemsArrayFirme>();
    this.dataSourceAlvo = new MatTableDataSource<ItemsArrayAlvo>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.firme = [];
    this.alvo = [];
    this.allergie = "";
    this.getDati();
  }

  ngAfterViewInit() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.dataSourceFirme = new MatTableDataSource<ItemsArrayFirme>();
    this.dataSourceAlvo = new MatTableDataSource<ItemsArrayAlvo>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.firme = [];
    this.alvo = [];
    this.allergie = "";
    this.getDati();
  }

  add(type: string) {
    const dialogRef = this.dialog.open(DialogSchedaTerapeuticaComponent, {
      data: {
        scheda: this.scheda,
        paziente: this.paziente,
        id: this.id,
        type: type,
        edit: false,
        theraphy: type.toLowerCase() != "alvo",
        alvo: type.toLowerCase() == "alvo",
      },
      width: "800px",
      height: "550px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDati();
    });
  }

  edit(row: any, type: String) {
    const dialogRef = this.dialog.open(DialogSchedaTerapeuticaComponent, {
      data: {
        scheda: this.scheda,
        paziente: this.paziente,
        type: type,
        id: this.id,
        edit: true,
        item: row,
        theraphy: type.toLowerCase() != "alvo",
        alvo: type.toLowerCase() == "alvo",
      },
      width: "800px",
      height: "550px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDati();
    });
  }
  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }
  async getDati() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.scheda = await this.schedaServ.getByPaziente(this.id);
    console.log(this.scheda);
    this.orali = this.scheda.Orale.sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceOrale.data = this.orali;
    this.dataSourceOrale.paginator = this.paginatorO;

    this.IMEVSC = this.scheda.IMEVSC.sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceIMEVSC.data = this.IMEVSC;
    this.dataSourceIMEVSC.paginator = this.paginatorI;

    this.Estemporanea = this.scheda.Estemporanea.sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceEstemporanea.data = this.Estemporanea;
    this.dataSourceEstemporanea.paginator = this.paginatorE;

    this.firme = this.scheda.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) || [];
    if ((this.firme[0] == null || this.firme[0] == undefined) || this.dateDiffInDays(new Date(this.firme[0].data), (new Date())) != 0) {
      if (this.firme[0] != null && this.firme[0] != undefined) {
        console.log("Disattivando il precedente record.");
        this.firme[0].attivaFirma = false;
      }
      let newFirma: ItemsArrayFirme = new ItemsArrayFirme();
      newFirma.data = new Date();
      newFirma.firmaMattina = "";
      newFirma.firmaPomeriggio = "";
      newFirma.firmaNotte = "";
      newFirma.attivaFirma = true;
      this.firme.push(newFirma);
      this.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.scheda.firme = this.firme;
      await this.schedaServ.update(this.scheda).toPromise().then();
    }

    this.alvo = this.scheda.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) || [];
    if ((this.alvo[0] == null || this.alvo[0] == undefined) || this.dateDiffInDays(new Date(this.alvo[0].data), (new Date())) != 0) {
      if (this.alvo[0] != null && this.alvo[0] != undefined) {
        console.log("Disattivando il precedente record.");
        this.alvo[0].attivo = false;
      }
      let newAlvo: ItemsArrayAlvo = new ItemsArrayAlvo();
      newAlvo.data = new Date();
      newAlvo.numeroAlviDiarroici = 0;
      newAlvo.numeroAlviNormali = 0;
      newAlvo.attivo = true;
      this.alvo.push(newAlvo);
      this.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.scheda.alvo = this.alvo;
      await this.schedaServ.update(this.scheda).toPromise().then();
    }
    this.allergie = this.scheda.allergie || "";
    this.dataSourceFirme.paginator = this.paginatorF;
    this.dataSourceFirme.data = this.firme;

    this.dataSourceAlvo.data = this.alvo;
    this.dataSourceAlvo.paginator = this.paginatorA;

    if ((new Date()).getHours() >= this.settings.turni[0].mattina[0].inizio.valueOf() && (new Date()).getHours() < this.settings.turni[0].mattina[0].fine.valueOf()) {
      if (this.firme[0].firmaMattina == "") this.tm = true;
      else this.tm = false;
    }
    else {
      if ((new Date()).getHours() >= this.settings.turni[0].pomeriggio[0].inizio.valueOf() && (new Date()).getHours() < this.settings.turni[0].pomeriggio[0].fine.valueOf()) {
        if (this.firme[0].firmaPomeriggio == "") this.tp = true;
        else this.tp = false;
      }
      else {
        if (this.firme[0].firmaNotte == "") this.tn = true;
        else this.tn = false;
      }
    }



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
  }

  async newDay() {


    if ((new Date()).getHours() >= this.settings.turni[0].mattina[0].inizio.valueOf() && (new Date()).getHours() < this.settings.turni[0].mattina[0].fine.valueOf()) {
      if (this.firme[0].firmaMattina == "") this.tm = true;
      else this.tm = false;
    }
    else {
      if ((new Date()).getHours() >= this.settings.turni[0].pomeriggio[0].inizio.valueOf() && (new Date()).getHours() < this.settings.turni[0].pomeriggio[0].fine.valueOf()) {
        if (this.firme[0].firmaPomeriggio == "") this.tp = true;
        else this.tp = false;
      }
      else {
        if (this.firme[0].firmaNotte == "") this.tn = true;
        else this.tn = false;
      }
    }


    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(this.settings.turni[0].mattina[0].inizio.valueOf(), 0, 0, 0); // Orario target

    const diff = Math.abs(now.getTime() - targetTime.getTime()); // Differenza in millisecondi
    const tolerance = 10; // Margine di tolleranza

    if (diff <= tolerance && !this.alreadyExecuted) {
      // Imposta il flag per evitare duplicazioni
      this.alreadyExecuted = true;

      console.log("Esecuzione: Orario target raggiunto!", now);

      let newAlvo: ItemsArrayAlvo = new ItemsArrayAlvo();
      newAlvo.data = now;
      newAlvo.numeroAlviDiarroici = 0;
      newAlvo.numeroAlviNormali = 0;
      newAlvo.attivo = true;

      let newFirma: ItemsArrayFirme = new ItemsArrayFirme();
      newFirma.data = now;
      newFirma.firmaMattina = "";
      newFirma.firmaPomeriggio = "";
      newFirma.firmaNotte = "";
      newFirma.attivaFirma = true;

      // Disattiva il precedente record firme (se esiste)
      this.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      if (this.firme[0] != null && this.firme[0] != undefined) {
        console.log("Disattivando il precedente record.");
        this.firme[0].attivaFirma = false;
      }

      // Disattiva il precedente record alvo (se esiste)
      this.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      if (this.alvo[0] != null && this.alvo[0] != undefined) {
        console.log("Disattivando il precedente record.");
        this.alvo[0].attivo = false;
      }

      // Inserisce il nuovo record
      this.alvo.push(newAlvo);
      this.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.dataSourceAlvo.data = this.alvo;
      this.dataSourceAlvo.paginator = this.paginatorA;
      this.scheda.alvo = this.alvo;

      // Inserisce il nuovo record
      this.firme.push(newFirma);
      this.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.dataSourceFirme.data = this.firme;
      this.dataSourceFirme.paginator = this.paginatorA;
      this.scheda.firme = this.firme;

      try {
        await this.schedaServ.update(this.scheda).toPromise();
        console.log("Aggiornamento completato con successo.");
      } catch (error) {
        console.error("Errore durante l'aggiornamento:", error);
      }
    } else if (diff > tolerance) {
      // Reimposta il flag quando l'istante è passato
      this.alreadyExecuted = false;
    }
  }

  private startCheckingTime(): void {
    console.log("DENTRO START");
    if (this.timerSubscription) {
      return; // Evita duplicazioni
    }
    this.timerSubscription = interval(1).subscribe(() => this.newDay());
  }

  private stopCheckingTime(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined!;
    }
  }


 async firmaTurno(type: String) {

    const dialogData = {
      data: { message: "Vuoi firmare il turno "+type+" ?" }
    };

    const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

    if (!result) {
      return;
    }


    switch (type) {
      case "mattutino":
        this.scheda.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].firmaMattina = this.dipendente.nome + " " + this.dipendente.cognome;
        this.tm = false;
        break;
      case "pomeridiano":
        this.scheda.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].firmaPomeriggio = this.dipendente.nome + " " + this.dipendente.cognome;
        this.tp = false;
        break;
      case "notturno":
        this.scheda.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].firmaNotte = this.dipendente.nome + " " + this.dipendente.cognome;
        this.tn = false;
        break;
   }

   try {
     await this.schedaServ.update(this.scheda).toPromise();
     console.log("Firmato con successo.");
   } catch (error) {
     console.error("Errore durante la firma:", error);
   }

  }

}
