export class AreaRiabilitativa {
  static clone(obj: AreaRiabilitativa) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.anamnesiRiabilitativa = "";
    this.test = {
      altro: "",
      dataSomministrazione: {
        arrivo: "",
        followUp1: "",
        followUp2: "",
        followUp3: "",
        followUp4: "",
        followUp5: "",
        followUp6: "",
      },
      FIM: {
        arrivo: "",
        followUp1: "",
        followUp2: "",
        followUp3: "",
        followUp4: "",
        followUp5: "",
        followUp6: "",
      },
      scalaTINETTI: {
        arrivo: "",
        followUp1: "",
        followUp2: "",
        followUp3: "",
        followUp4: "",
        followUp5: "",
        followUp6: "",
      },
      indiceBARTHEL: {
        arrivo: "",
        followUp1: "",
        followUp2: "",
        followUp3: "",
        followUp4: "",
        followUp5: "",
        followUp6: "",
      },
    };

    this.lesioni = undefined;
    this.diagnosiFunzionamento = "";
  }

  anamnesiRiabilitativa: String;
  test: {
    altro: String;
    dataSomministrazione: {
      arrivo: String;
      followUp1: String;
      followUp2: String;
      followUp3: String;
      followUp4: String;
      followUp5: String;
      followUp6: String;
    };
    FIM: {
      arrivo: String;
      followUp1: String;
      followUp2: String;
      followUp3: String;
      followUp4: String;
      followUp5: String;
      followUp6: String;
    };
    scalaTINETTI: {
      arrivo: String;
      followUp1: String;
      followUp2: String;
      followUp3: String;
      followUp4: String;
      followUp5: String;
      followUp6: String;
    };
    indiceBARTHEL: {
      arrivo: String;
      followUp1: String;
      followUp2: String;
      followUp3: String;
      followUp4: String;
      followUp5: String;
      followUp6: String;
    };
  };


  lesioni: [{
    data: Date,
    tipologia: String,
    parteCorpo: String
  }];

  diagnosiFunzionamento: String;
}
