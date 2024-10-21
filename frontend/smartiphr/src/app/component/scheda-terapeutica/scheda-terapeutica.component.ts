import { Component, Input, OnInit } from "@angular/core";
import { ChartDataSets, ChartType, RadialChartOptions } from "chart.js";
import * as moment from "moment";
import { Label } from "ng2-charts";
import { Subject } from 'rxjs';
import { PazienteService } from "src/app/service/paziente.service";
import { SchedaTerapeuticaService } from "../../service/schedaTerapeutica.service";
import { SchedaTerapeutica } from "../../models/schedaTerapeutica";
import { Paziente } from "../../models/paziente";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";

interface RigaTabella {
  dataInizio: string;
  terapiaOrale: string;
  fasceOrarie: string[];
  dataFine: string;
}

@Component({
  selector: "app-scheda-terapeutica",
  templateUrl: "./scheda-terapeutica.component.html",
  styleUrls: ["./scheda-terapeutica.component.css"],
})

export class SchedaTerapeuticaComponent implements OnInit {
  @Input() id: string; //Id paziente
  @Input() saveEvent: Subject<string>;
  @Input() inLettura: boolean;

  currentDate: moment.Moment;
  maxDate: string;
  disable: boolean;
  paziente: Paziente;

  // Aggiungi variabili separate per ogni tabella
  righeTabellaOrale: RigaTabella[] = [];
  righeTabellaImEvSc: RigaTabella[] = [];
  righeTabellaEstemporanea: RigaTabella[] = [];

  constructor(
    public pazienteService: PazienteService,
    private schedaServ: SchedaTerapeuticaService
  ) {
    this.paziente = new Paziente();
    this.pazienteService.getPaziente(this.id).then((res: Paziente) => {
      this.paziente = res[0];
    });

    this.schedaServ.getByPaziente(this.id).then((result: SchedaTerapeutica) => {
      if (result) {
        this.righeTabellaOrale = result.terapieOrali.map(terapia => ({
          dataInizio: terapia.dataInizio,
          terapiaOrale: terapia.terapiaOrale,
          fasceOrarie: terapia.fasceOrarie || [],
          dataFine: terapia.dataFine || '',
        }));

        this.righeTabellaImEvSc = result.terapieImEvSc.map(terapia => ({
          dataInizio: terapia.dataInizio,
          terapiaImEvSc: terapia.terapiaImEvSc,
          fasceOrarie: terapia.fasceOrarie || [],
          dataFine: terapia.dataFine || '',
        }));

        this.righeTabellaEstemporanea = result.terapieEstemporanee.map(terapia => ({
          dataInizio: terapia.dataInizio,
          terapiaEstemporanea: terapia.terapiaEstemporanea,
          fasceOrarie: terapia.fasceOrarie || [],
          dataFine: terapia.dataFine || '',
        }));
      }
    });
  }

  ngOnInit() {
    this.disable = true;
    this.currentDate = moment();
    this.setMaxDateForDataInizio();
    this.aggiungiRiga('orale');
    this.aggiungiRiga('imevsc');
    this.aggiungiRiga('estemporanea');

    if (this.saveEvent) {
      this.saveEvent.subscribe(v => {
        console.log('saveEvent', v);
      });
    }
  }

  async save() {
    // Creazione di un oggetto SchedaTerapeutica per il salvataggio
    const schedaTerapeutica: SchedaTerapeutica = {
      idPaziente: this.id, // Imposta l'id del paziente se necessario
      terapieOrali: this.righeTabellaOrale.map(riga => ({
        dataInizio: riga.dataInizio,
        terapiaOrale: riga.terapiaOrale,
        fasceOrarie: riga.fasceOrarie,
        dataFine: riga.dataFine
      })),
      terapieImEvSc: this.righeTabellaImEvSc.map(riga => ({
        dataInizio: riga.dataInizio,
        terapiaImEvSc: riga.terapiaOrale, // se il campo "terapiaImEvSc" è diverso, aggiusta qui
        fasceOrarie: riga.fasceOrarie,
        dataFine: riga.dataFine
      })),
      terapieEstemporanee: this.righeTabellaEstemporanea.map(riga => ({
        dataInizio: riga.dataInizio,
        terapiaEstemporanea: riga.terapiaOrale,
        fasceOrarie: riga.fasceOrarie,
        dataFine: riga.dataFine
      }))
    };

    // Utilizzo del servizio per il salvataggio
    this.schedaServ.saveSchedaTerapeutica(schedaTerapeutica).then(response => {
      console.log("Dati salvati con successo:", response);
      // Qui potresti gestire la logica post-salvataggio (notifiche, reindirizzamenti, ecc.)
    }).catch(error => {
      console.error("Errore durante il salvataggio:", error);
    });
  }

  setMaxDateForDataInizio(): void {
    const today = moment();
    this.maxDate = today.format('YYYY-MM-DD');
  }

  onDataInizioChange(event: any, index: number, tipo: string): void {
    this.getRigheTabella(tipo)[index].dataInizio = event.target.value;
    this.onDataFineEnabled(index, tipo);
    this.checkFormCompletion(index, tipo);
  }

  onTerapiaOraleChange(event: any, index: number, tipo: string): void {
    this.getRigheTabella(tipo)[index].terapiaOrale = event.target.value;
    this.onDataFineEnabled(index, tipo);
    this.checkFormCompletion(index, tipo);
  }

  onFasciaOrariaChange(event: any, orario: string, index: number, tipo: string): void {
    const righeTabella = this.getRigheTabella(tipo);
    if (event.target.checked) {
      righeTabella[index].fasceOrarie.push(orario);
    } else {
      righeTabella[index].fasceOrarie = righeTabella[index].fasceOrarie.filter(o => o !== orario);
    }
    this.onDataFineEnabled(index, tipo);
    this.checkFormCompletion(index, tipo);
  }

  onDataFineEnabled(index: number, tipo: string): void {
    const riga = this.getRigheTabella(tipo)[index];
    if (riga.dataInizio) {
      this.disable = false;
    } else {
      riga.dataFine = ''; // Reset di dataFine se manca un campo obbligatorio
    }
  }

  checkFormCompletion(index: number, tipo: string): void {
    const riga = this.getRigheTabella(tipo)[index];
    if (riga.dataInizio) {
      this.aggiungiRiga(tipo); // Aggiunge una nuova riga solo quando tutti i campi sono completati
    }
  }

  openCalendar(event: any): void {
    event.target.showPicker();
  }

  aggiungiRiga(tipo: string): void {
    const nuovaRiga: RigaTabella = {
      dataInizio: '',
      terapiaOrale: '',
      fasceOrarie: [],
      dataFine: '',
    };

    const righeTabella = this.getRigheTabella(tipo);
    const ultimaRiga = righeTabella[righeTabella.length - 1];
    if (!ultimaRiga || ultimaRiga.dataInizio) {
      righeTabella.push(nuovaRiga);
    }
  }

  // Funzione per ottenere il corretto array di righe per ogni tabella
  getRigheTabella(tipo: string): RigaTabella[] {
    if (tipo === 'orale') {
      return this.righeTabellaOrale;
    } else if (tipo === 'imevsc') {
      return this.righeTabellaImEvSc;
    } else if (tipo === 'estemporanea') {
      return this.righeTabellaEstemporanea;
    }
    return [];
  }

}

function result(value: SchedaTerapeutica): SchedaTerapeutica | PromiseLike<SchedaTerapeutica> {
    throw new Error("Function not implemented.");
}
