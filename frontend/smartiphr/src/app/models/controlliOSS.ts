export class ControlliOSS {
    static clone(obj:ControlliOSS) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id?: string;
    operatorNamePrimavera?: string;
    operatorNameEstate?: string;
    operatorNameAutunno?: string;
    operatorNameInverno?: string;

    operatorNameGennaio?: string;
    operatorNameFebbraio?: string;
    operatorNameMarzo?: string;
    operatorNameAprile?: string;
    operatorNameMaggio?: string;
    operatorNameGiugno?: string;
    operatorNameLuglio?: string;
    operatorNameAgosto?: string;
    operatorNameSettembre?: string;
    operatorNameOttobre?: string;
    operatorNameNovembre?: string;
    operatorNameDicembre?: string;

    primavera?: Date;
    estate?: Date;
    autunno?: Date;
    inverno?: Date;

    gennaio?: Date;
    febbraio?: Date;
    marzo?: Date;
    aprile?: Date;
    maggio?: Date;
    giugno?: Date;
    operatorNameLluglio?: Date;
    agosto?: Date;
    settembre?: Date;
    ottobre?: Date;
    novembre?: Date;
    dicembre?: Date;


    paziente?: string;
    pazienteName?: string;


    anno?: string;

  }
  