export class AreaRiabilitativaTest {
  static clone(obj: AreaRiabilitativaTest) {
    return JSON.parse(JSON.stringify(obj));
  }

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

  constructor() {
    (this.altro = ""),
      (this.dataSomministrazione = {
        arrivo: "",
        followUp1: "",
        followUp2: "",
        followUp3: "",
        followUp4: "",
        followUp5: "",
        followUp6: "",
      });

    this.FIM = {
      arrivo: "",
      followUp1: "",
      followUp2: "",
      followUp3: "",
      followUp4: "",
      followUp5: "",
      followUp6: "",
    };

    this.scalaTINETTI = {
      arrivo: "",
      followUp1: "",
      followUp2: "",
      followUp3: "",
      followUp4: "",
      followUp5: "",
      followUp6: "",
    };

    this.indiceBARTHEL = {
      arrivo: "",
      followUp1: "",
      followUp2: "",
      followUp3: "",
      followUp4: "",
      followUp5: "",
      followUp6: "",
    };
  }
}
