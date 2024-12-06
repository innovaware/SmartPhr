export class ItemsArray {
  DataInizio?: Date;
  Terapia?: string;
  FasceOrarie?: Array<{
    sette: boolean;
    otto: boolean;
    dieci: boolean;
    dodici: boolean;
    sedici: boolean;
    diciassette: boolean;
    diciotto: boolean;
    venti: boolean;
    ventidue: boolean;
    ventitre: boolean;
  }>;
  DataFine?: Date;
  Note?: string;

  constructor() {
    this.DataInizio = undefined; // O `new Date()` se vuoi una data iniziale
    this.Terapia = '';
    this.Note = '';
    this.FasceOrarie = [{
      sette: false,
      otto: false,
      dieci: false,
      dodici: false,
      sedici: false,
      diciassette: false,
      diciotto: false,
      venti: false,
      ventidue: false,
      ventitre: false
    }];
    this.DataFine = undefined; // O `new Date()` per una data finale iniziale
  }
}


export class ItemsArrayFirme {
  data: Date;
  firmaMattina: String;
  firmaPomeriggio: String;
  firmaNotte: String;
  attivaFirma: Boolean;
}

export class ItemsArrayAlvo {
  attivo: Boolean;
  data: Date;
  numeroAlviNormali: Number;
  numeroAlviDiarroici: Number;
}

export class SchedaTerapeutica {
  _id?: String;
  idPaziente: String;
  Orale?: ItemsArray[] = [];   // Inizializzazione come array vuoto
  IMEVSC?: ItemsArray[] = []; // Inizializzazione come array vuoto
  Estemporanea?: ItemsArray[] = []; // Inizializzazione come array vuoto
  firme: ItemsArrayFirme[] = [];
  alvo: ItemsArrayAlvo[] = [];
  allergie: string;
}
