export class SchedaTerapeutica {
  _id?: String;
  idPaziente: String;

  Orale?: [{
    DataInizioOrale?: Date;
    TerapiaOrale?: String;
    FasceOrarieOrale?: [{ sette: Boolean, otto: Boolean, dieci: Boolean, dodici: Boolean, sedici: Boolean, diciassette: Boolean, diciotto: Boolean, venti: Boolean, ventidue: Boolean, ventitre: Boolean }];
    DataFineOrale?: Date;
  }];

  IMEVSC?: [{
    DataInizioIMEVSC?: Date;
    TerapiaIMEVSC?: String;
    FasceOrarieIMEVSC?: [{ sette: Boolean, otto: Boolean, dieci: Boolean, dodici: Boolean, sedici: Boolean, diciassette: Boolean, diciotto: Boolean, venti: Boolean, ventidue: Boolean, ventitre: Boolean }];
    DataFineIMEVSC?: Date;
  }];

  Estemporanea?: [{
    DataInizioEstemporanea?: Date;
    TerapiaEstemporanea?: String;
    FasceOrarieEstemporanea?: [{ sette: Boolean, otto: Boolean, dieci: Boolean, dodici: Boolean, sedici: Boolean, diciassette: Boolean, diciotto: Boolean, venti: Boolean, ventidue: Boolean, ventitre: Boolean }];
    DataFineEstemporanea?: Date;
  }];
    terapieOrali: any;
    terapieImEvSc: any;
    terapieEstemporanee: any;

}
