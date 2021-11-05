
export class schedaAnamnesiFamigliare {
    static clone(obj: schedaAnamnesiFamigliare) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.ipertensione = false;
      this.diabete = false;
      this.malatCardiovascolari = false;
      this.malatCerebrovascolari = false;
      this.demenza = false;
      this.neoplasie = false;
      this.altro = false;
      this.testoAltro = "";
      this.antitetanica = false;
      this.antiepatiteB = false;
      this.antinfluenzale = false;
      this.altre = false;
      this.testoAltre = "";
      this.attLavorative = "";
      this.scolarita = "";
      this.servizioMilitare = "";
      this.menarca = "";
      this.menopausa = "";
      this.attFisica = "";
      this.alimentazione = "";
      this.alvo = "";
      this.alcolici = "";
      this.sonno = "";

      
    }
  
  
    ipertensione?: boolean;
    diabete?: boolean;
    malatCardiovascolari?: boolean;
    malatCerebrovascolari?: boolean;
    demenza?: boolean;
    neoplasie?: boolean;
    altro?: boolean;
    testoAltro: String;
    antitetanica?: boolean;
    antiepatiteB?: boolean;
    antinfluenzale?: boolean;
    altre?: boolean;
    testoAltre: String;
    attLavorative: String;
    scolarita: String;
    servizioMilitare: String;
    menarca: String;
    menopausa: String;
    attFisica: String;
    alimentazione: String;
    alvo: String;
    diurisi: String;
    alcolici: String;
    fumo: String;
    sonno: String;
  }
  
  
  