import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { Ferie } from "src/app/models/ferie";
import { FerieService } from "src/app/service/ferie.service";
import { MessagesService } from "src/app/service/messages.service";
import { SettingsService } from "../../service/settings.service";
import { Settings } from "../../models/settings";

@Component({
  selector: "app-ferie",
  templateUrl: "./ferie.component.html",
  styleUrls: ["./ferie.component.css"],
})
export class FerieComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;
  @Input() dipendente: Dipendenti;

  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    ferie: Ferie;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "cf",
    "accettata",
    "action",
  ];

  displayedColumnsExternal: string[] = [
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "action",
  ];

  public nuovoRichiestaFerie: Ferie;
  public richieste: Ferie[];
  public uploadingRichiestaFerie: boolean;
  public setting: Settings;
  public addingRichiestaFerie: boolean;

  @ViewChild("paginatorFerie", { static: false })
  FeriePaginator: MatPaginator;
  dataSource: MatTableDataSource<Ferie>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public messageService: MessagesService,
    public ferieService: FerieService,
    public settingService: SettingsService
  ) {
    this.richieste = [];
  }

  ngOnChanges(changes) {
    this.getSettings();
    if (this.data && this.data._id) {
      this.ferieService.getFerieByDipendenteID(this.data._id).then((result) => {
        this.dataSource = new MatTableDataSource<Ferie>(result);
        this.dataSource.paginator = this.paginator;
        this.richieste = result;
      });
    } else if (this.data) {
      this.ferieService.getFerieByDipendenteID(this.data._id).then((result) => {
        this.richieste = result;
        this.dataSource = new MatTableDataSource<Ferie>(this.richieste);
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  async getSettings(): Promise<Settings> {
    if (this.setting) {
      return this.setting;
    }
    try {
      const res = await this.settingService.getSettings();
      if (res ) {
        this.setting = res;
      }
      return this.setting;
    } catch (err) {
      console.error("Errore caricamento impostazioni: ", err);
      return null;
    }
  }

  ngOnInit() {
    this.nuovoRichiestaFerie = new Ferie();
    this.getSettings();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(ferie: Ferie, item: string) {
    this.showItemEmiter.emit({ ferie: ferie, button: item });
  }

  async updateFerie(ferie: Ferie) {
    this.ferieService
      .updateFerie(ferie)
      .then((result: Ferie) => {
        const index = this.richieste.indexOf(ferie);
        ferie.closed = true;
        this.richieste[index] = ferie;

        this.dataSource.data = this.richieste;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore modifica stato ferie");
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
      this.updateFerie(row);
    }
  }

  // RICHIESTE EXTERNAL
  async addRichiestaFerie() {
    this.nuovoRichiestaFerie = new Ferie();
    this.addingRichiestaFerie = true;
  }

  async delete(ferie: Ferie) {
    console.log("Cancella Ferie: ", ferie);

    this.ferieService
      .remove(ferie)
      .then((x) => {
        console.log("richiesta cancellata");
        const index = this.richieste.indexOf(ferie);
        if (index > -1) {
          this.richieste.splice(index, 1);
        }
        this.dataSource.data = this.richieste;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione della richiesta");
        console.error(err);
      });
  }

  dateDiffInDays(a: Date, b: Date) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  async saveRichiestaFerie(ferie: Ferie) {
    console.log("Data: ", this.data);
    if (this.data && this.data._id) {
      ferie.user = this.data._id;
    }

    var campi = "";
    if (!ferie.dataInizio) {
      campi += " Data Inizio";
    }
    if (!ferie.dataFine) {
      campi += " Data Fine";
    }
    if (campi !== "") {
      this.messageService.showMessageError(`I campi${campi} sono obbligatori!`);
      this.addingRichiestaFerie = true;
      return;
    }

    const dInizio = new Date(ferie.dataInizio);
    const dFine = new Date(ferie.dataFine);

    if (dFine < dInizio) {
      this.addingRichiestaFerie = true;
      this.messageService.showMessageError(`Non puoi impostare la data di fine ferie prima della data di inizio!`);
      return;
    }

    // Assicuriamoci che i settings siano caricati
    await this.getSettings();

    // Verifico se le impostazioni del periodo ferie sono state configurate
    if (this.setting && this.setting.PeriodoFerieInizio && this.setting.PeriodoFerieFine) {
      const periodoInizio = new Date(this.setting.PeriodoFerieInizio);
      const periodoFine = new Date(this.setting.PeriodoFerieFine);
      const oggi = new Date();

      // Se le ferie ricadono nel periodo ferie configurato, verifica che la richiesta avvenga entro la data fine inserimento
      if (dInizio >= periodoInizio) {
        if (oggi > periodoFine) {
          this.addingRichiestaFerie = true;
          this.messageService.showMessageError(
            `Il periodo per inserire le ferie per questa fascia temporale è scaduto il ${periodoFine.toLocaleDateString()}!`
          );
          return;
        }
      }
    }

    this.uploadingRichiestaFerie = true;
    console.log("Invio Richiesta Ferie: ", ferie);

    this.ferieService
      .insertFerie(ferie)
      .then((result: Ferie) => {
        console.log("Insert Ferie: ", result);
        this.richieste.push(result);
        this.dataSource.data = [...this.richieste];
        this.addingRichiestaFerie = false;
        this.uploadingRichiestaFerie = false;
        this.nuovoRichiestaFerie = new Ferie();
        this.messageService.showMessage("Richiesta di ferie inserita con successo");
      })
      .catch((err) => {
        this.uploadingRichiestaFerie = false;
        this.messageService.showMessageError(
          "Errore nell'inserimento della richiesta di ferie"
        );
        console.error(err);
      });
  }
}
