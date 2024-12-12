export class RifiutiSpeciali {
  _id: String;
  anno: Number; // L'anno di riferimento
  mesi: Mese[]; // Array dei mesi

  constructor(anno: Number, mesi: Mese[]) {
    this.anno = anno;
    this.mesi = mesi;
  }
}

export class Mese {
  mese: String; // Nome del mese
  data: String; // Data (formato Stringa per il binding con il controllo)
  rifiutiSpeciali: Number; // Quantità di rifiuti speciali
  farmaciScaduti: Number; // Quantità di farmaci scaduti
  firmaIp: String; // Stato della firma (es. "Firmato")
  IpId: String;
  note: String; // Eventuali note

  constructor(
    mese: String,
    data: String = "",
    rifiutiSpeciali: Number = 0,
    farmaciScaduti: Number = 0,
    firmaIp: String = "",
    IpId: String = "",
    note: String = ""
  ) {
    this.mese = mese;
    this.data = data;
    this.rifiutiSpeciali = rifiutiSpeciali;
    this.farmaciScaduti = farmaciScaduti;
    this.firmaIp = firmaIp;
    this.IpId = IpId;
    this.note = note;
  }
}
