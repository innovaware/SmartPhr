import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PazienteService } from "src/app/service/paziente.service";
import { SchedaTerapeuticaService } from "../../service/schedaTerapeutica.service";
import { ItemsArray, ItemsArrayAlvo, ItemsArrayFirme, SchedaTerapeutica } from "../../models/schedaTerapeutica";
import { Paziente } from "../../models/paziente";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
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
import { DialogQuestionComponent } from "../../dialogs/dialog-question/dialog-question.component";

@Component({
  selector: "app-scheda-terapeutica",
  templateUrl: "./scheda-terapeutica.component.html",
  styleUrls: ["./scheda-terapeutica.component.css"],
})
export class SchedaTerapeuticaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() id: string; // Id paziente
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
  public note: string;

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
    this.note = "";
    this.settings = new Settings();
    this.tm = false;
    this.tp = false;
    this.tn = false;
  }

  async ngOnInit() {
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
    this.note = "";

    if (this.id) {
      try {
        const xPaziente = await this.pazienteService.getPaziente(this.id);
        this.paziente = xPaziente?.[0] || new Paziente();
      } catch (e) {
        console.error("Errore recupero paziente", e);
      }
    }

    try {
      const xSettings = await this.setServ.getSettings();
      this.settings = xSettings?.[0] || new Settings();
    } catch (e) {
      console.error("Errore recupero impostazioni", e);
    }

    await this.getDati();
    this.loadUser();
    this.startCheckingTime();
  }

  ngOnDestroy(): void {
    this.stopCheckingTime();
  }

  ngOnChanges() {
    if (this.id) {
      this.getDati();
    }
  }

  ngAfterViewInit() {
    this.dataSourceOrale.paginator = this.paginatorO;
    this.dataSourceIMEVSC.paginator = this.paginatorI;
    this.dataSourceEstemporanea.paginator = this.paginatorE;
    this.dataSourceFirme.paginator = this.paginatorF;
    this.dataSourceAlvo.paginator = this.paginatorA;
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

  dateDiffInDays(a: Date, b: Date) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  save(): void {
    console.log('Allergie salvate automaticamente:', this.element.allergie);
    console.log('Note salvate automaticamente:', this.element.note);
  }

  async getDati() {
    if (!this.id) return;

    this.scheda = await this.schedaServ.getByPaziente(this.id);
    if (!this.scheda) {
      this.scheda = new SchedaTerapeutica();
      this.scheda.firme = [];
      this.scheda.Orale = [];
      this.scheda.IMEVSC = [];
      this.scheda.Estemporanea = [];
      this.scheda.alvo = [];
      this.scheda.idPaziente = this.id;
      this.scheda.allergie = "";
      this.scheda.note = "";
    }

    this.orali = (this.scheda.Orale || []).sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceOrale.data = this.orali;

    this.IMEVSC = (this.scheda.IMEVSC || []).sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceIMEVSC.data = this.IMEVSC;

    this.Estemporanea = (this.scheda.Estemporanea || []).sort((a, b) => new Date(b.DataInizio).getTime() - new Date(a.DataInizio).getTime());
    this.dataSourceEstemporanea.data = this.Estemporanea;

    this.firme = (this.scheda.firme || []).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    if (this.firme.length === 0 || this.dateDiffInDays(new Date(this.firme[0].data), new Date()) !== 0) {
      if (this.firme[0]) {
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
      await this.schedaServ.update(this.scheda).toPromise();
    }

    this.alvo = (this.scheda.alvo || []).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    if (this.alvo.length === 0 || this.dateDiffInDays(new Date(this.alvo[0].data), new Date()) !== 0) {
      if (this.alvo[0]) {
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
      await this.schedaServ.update(this.scheda).toPromise();
    }

    this.element.allergie = this.scheda.allergie || "";
    this.element.note = this.scheda.note || "";
    this.dataSourceFirme.data = this.firme;
    this.dataSourceAlvo.data = this.alvo;

    this.checkTurnoAttivo();
  }

  checkTurnoAttivo() {
    if (!this.settings?.turni?.[0] || !this.firme?.[0]) return;

    const currentHour = (new Date()).getHours();
    const mattina = this.settings.turni[0].mattina?.[0];
    const pomeriggio = this.settings.turni[0].pomeriggio?.[0];

    this.tm = false;
    this.tp = false;
    this.tn = false;

    if (mattina && currentHour >= mattina.inizio.valueOf() && currentHour < mattina.fine.valueOf()) {
      this.tm = this.firme[0].firmaMattina === "";
    } else if (pomeriggio && currentHour >= pomeriggio.inizio.valueOf() && currentHour < pomeriggio.fine.valueOf()) {
      this.tp = this.firme[0].firmaPomeriggio === "";
    } else {
      this.tn = this.firme[0].firmaNotte === "";
    }
  }

  loadUser() {
    this.dipendente = new Dipendenti();
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      if (user?.dipendenteID) {
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
      }
    });
  }

  async newDay() {
    if (!this.settings?.turni?.[0] || !this.firme || this.firme.length === 0) {
      return;
    }

    this.checkTurnoAttivo();

    const now = new Date();
    const mattinaInizio = this.settings.turni[0].mattina?.[0]?.inizio?.valueOf() ?? 7;
    const targetTime = new Date();
    targetTime.setHours(mattinaInizio, 0, 0, 0);

    const diff = Math.abs(now.getTime() - targetTime.getTime());
    const tolerance = 1000; // Margine portato a 1 secondo

    if (diff <= tolerance && !this.alreadyExecuted) {
      this.alreadyExecuted = true;

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

      this.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      if (this.firme[0]) {
        this.firme[0].attivaFirma = false;
      }

      this.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      if (this.alvo[0]) {
        this.alvo[0].attivo = false;
      }

      this.alvo.push(newAlvo);
      this.alvo.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.dataSourceAlvo.data = this.alvo;
      this.scheda.alvo = this.alvo;

      this.firme.push(newFirma);
      this.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      this.dataSourceFirme.data = this.firme;
      this.scheda.firme = this.firme;

      try {
        await this.schedaServ.update(this.scheda).toPromise();
      } catch (error) {
        console.error("Errore durante l'aggiornamento:", error);
      }
    } else if (diff > tolerance) {
      this.alreadyExecuted = false;
    }
  }

  private startCheckingTime(): void {
    if (this.timerSubscription) {
      return;
    }
    // Esegue il controllo ogni 1 secondo (1000 ms)
    this.timerSubscription = interval(1000).subscribe(() => this.newDay());
  }

  private stopCheckingTime(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined!;
    }
  }

  async firmaTurno(type: String) {
    if (!this.scheda?.firme || this.scheda.firme.length === 0) {
      this.messageService.showMessageError("Nessun registro firme valido disponibile.");
      return;
    }

    const dialogData = {
      data: { message: "Vuoi firmare il turno " + type + " ?" }
    };

    const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

    if (!result) {
      return;
    }

    const ultimaFirma = this.scheda.firme.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
    const nomeFirma = (this.dipendente?.nome || '') + " " + (this.dipendente?.cognome || '');

    switch (type) {
      case "mattutino":
        ultimaFirma.firmaMattina = nomeFirma;
        this.tm = false;
        break;
      case "pomeridiano":
        ultimaFirma.firmaPomeriggio = nomeFirma;
        this.tp = false;
        break;
      case "notturno":
        ultimaFirma.firmaNotte = nomeFirma;
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
