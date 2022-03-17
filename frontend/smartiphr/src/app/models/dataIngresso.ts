
export class dataIngresso {
    static clone(obj: dataIngresso) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    _id?: string;
    sanificazione?: boolean;
    sistemazione_letto?: boolean;
    armadio?: string;
    trattamento_igienico?: boolean;
    paziente?: string;
    user?: string;
  
  }
  