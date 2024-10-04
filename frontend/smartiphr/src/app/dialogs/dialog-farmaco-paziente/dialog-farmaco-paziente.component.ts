import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Farmaci } from 'src/app/models/farmaci';
import { GestFarmaciService } from 'src/app/service/gest-farmaci.service';
import { ArmadioFarmaci } from '../../models/armadioFarmaci';
import { GestPresidiService } from '../../service/gest-presidi.service';
import { Materiali } from '../../models/materiali';
import { Presidi } from '../../models/presidi';
import { MessagesService } from '../../service/messages.service';
import { ArmadioFarmaciService } from '../../service/armadioFarmaci.service';
import { FarmacoArmadio, PresidioArmadio } from '../../models/armadioFarmaciPresidi';
import { AttivitaFarmaciPresidi } from '../../models/attivitaFarmaciPresidi';
import { AttivitafarmacipresidiService } from '../../service/attivitafarmacipresidi.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Dipendenti } from '../../models/dipendenti';
import { Paziente } from '../../models/paziente';

@Component({
  selector: 'app-dialog-farmaco-paziente',
  templateUrl: './dialog-farmaco-paziente.component.html',
  styleUrls: ['./dialog-farmaco-paziente.component.css']
})
export class DialogFarmacoPazienteComponent implements OnInit {
  materiali: any[] = [];
  materiale: string;
  quantita: Number = 0;
  quantitaMax: Number = 0;
  note: String;
  farmaco: FarmacoArmadio;
  presidio: PresidioArmadio;
  disable: boolean;
  qtTemp: Number;
  dipendente: Dipendenti;
  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoPazienteComponent>,
    public farmaciService: GestFarmaciService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public presServ: GestPresidiService,
    public messageService: MessagesService,
    public MS: MessagesService,
    public AFS: ArmadioFarmaciService,
    private AFPS: AttivitafarmacipresidiService,
    @Inject(MAT_DIALOG_DATA) public data: {
      type: String,
      armadioFarmaci: ArmadioFarmaci,
      editMode: Boolean,
      materiale: any,
      id: String,
      paziente:Paziente,
    }
  ) {
    this.materiali = [];
    this.initializeMateriali();
    this.quantita = 0;
    this.note = "";
    this.loadUser();
  }


  loadUser() {
    this.dipendente = new Dipendenti();
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            this.dipendente = x[0];
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }



  async initializeMateriali() {
    if (this.data.type === "farmaco") {
      this.materiali = await this.farmaciService.getFarmaci();
      this.materiali = this.materiali.filter(x=>new Date(x.scadenza)> new Date());
      if (this.data.editMode) {
        // Recupera i dettagli del farmaco e imposta la quantità massima prima di continuare
        this.farmaciService.getById(this.data.id).then((r: Farmaci) => {
          console.log(r);
          this.quantitaMax = r.quantitaDisponibile; 
        });
        this.setFarmacoDetails();
      } else {
        this.disable = false;
      }
    }

    if (this.data.type === "presidio") {
      this.materiali = await this.presServ.getPresidi();
      this.materiali = this.materiali.filter(x => new Date(x.scadenza) > new Date() || x.scadenza == undefined);
      if (this.data.editMode) {
        // Recupera i dettagli del farmaco e imposta la quantità massima prima di continuare
        this.presServ.getById(this.data.id).then((r: Presidi) => {
          console.log(r);
          this.quantitaMax = r.quantitaDisponibile;
        });
        this.setPresidioDetails();
      } else {
        this.disable = false;
      }
    }
  }

  // Funzione per impostare i dettagli del farmaco
  setFarmacoDetails() {
    this.farmaco = this.data.materiale;
    this.materiale = this.farmaco.farmacoID.valueOf();
    this.quantita = this.farmaco.quantita.valueOf();
    this.qtTemp = this.quantita;
    this.note = this.farmaco.note;
    this.disable = true;
  }

  // Funzione per impostare i dettagli del presidio
  setPresidioDetails() {
    this.presidio = this.data.materiale;
    this.materiale = this.presidio.presidioID.valueOf();
    this.quantita = this.data.materiale.qtyTot;
    this.qtTemp = this.quantita;
    this.note = this.presidio.note;
    this.disable = true;
  }




  ngOnInit() {
   
  }

  async save() {
    try {
      let itemService, item, itemType, type;

      // Impostiamo il tipo di materiale e il servizio corrispondente
      if (this.data.type === "farmaco") {
        itemService = this.farmaciService;
        itemType = "farmaci";
        type = "farmaco";
        item = new FarmacoArmadio();
      } else if (this.data.type === "presidio") {
        itemService = this.presServ;
        itemType = "presidi";
        type = "presidio";
        item = new PresidioArmadio();
      }

      // Ottieni l'elemento corrispondente dal servizio
      let itemFP = await itemService.getById(this.materiale);
      if (!itemFP) {
        console.error("Errore: elemento non trovato per l'ID:", this.materiale);
        this.MS.showMessageError("Errore: elemento non trovato.");
        return;
      }

      console.log("Elemento trovato:", itemFP);

      // Controlli di validità sulla quantità
      if (this.quantita > this.quantitaMax || (this.data.editMode && this.quantita > this.qtTemp && this.quantita > this.quantitaMax)) {
        this.MS.showMessageError("Quantità superiore alla quantità massima. Disponibilità: " + this.quantitaMax);
        return;
      }

      // Aggiorniamo i campi principali dell'elemento
      item.quantita = this.quantita.valueOf();
      item.note = this.note?.valueOf() || '';
      item.nome = itemFP.nome || '';
      item.dataScadenza = itemFP.scadenza;
      if (itemType === "farmaci") {
        item.farmacoID = itemFP._id;
        console.log("Assegnato farmacoID:", item.farmacoID);
      } else if (itemType === "presidi") {
        item.presidioID = itemFP._id;
        console.log("Assegnato presidioID:", item.presidioID);
      }
      if (!this.data.editMode) {
        // Modalità inserimento
        console.log("Modalità inserimento attiva.");
       

        item.dataScadenza = itemFP.scadenza;
        console.log("Elemento salvato:", item);

        // Salvataggio nell'array
        this.data.armadioFarmaci[itemType].push(item);
        await this.AFS.update(this.data.armadioFarmaci, "").toPromise();

        // Aggiorna le quantità disponibili e occupate nel servizio
        itemFP.quantitaDisponibile = itemFP.quantitaDisponibile - this.quantita.valueOf();
        itemFP.quantitaOccupata = (itemFP.quantitaOccupata || 0) + this.quantita.valueOf();

        // Creazione e inizializzazione dell'oggetto AttivitaFarmaciPresidi
        const af: AttivitaFarmaciPresidi = {
          dataOP: new Date(),
          elemento: item.nome,
          elemento_id: itemFP._id,
          operation: "Inserimento " + type,
          type: itemType,
          elementotype: itemType,
          qty: item.quantita.toString(),
          operator: this.dipendente._id,
          operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
          paziente: this.data.paziente._id,
          pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
        };

        // Inserimento dell'attività
        await this.AFPS.addArmF(af);

      } else {
        // Modalità modifica
        const index = this.data.armadioFarmaci[itemType].indexOf(this.data.materiale);
        console.log("Modalità modifica attiva. Elemento attuale:", this.data.armadioFarmaci[itemType][index]);

        if (this.data.armadioFarmaci[itemType][index].quantita < item.quantita) {
          const af: AttivitaFarmaciPresidi = {
            dataOP: new Date(),
            elemento: item.nome,
            elemento_id: itemFP._id,
            operation: "Carico " + type,
            type: itemType,
            elementotype: itemType,
            qty: (Math.abs(this.data.materiale.quantita - item.quantita)).toString(),
            qtyRes: item.quantita.toString(),
            operator: this.dipendente._id,
            operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            paziente: this.data.paziente._id,
            pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
          };
          await this.AFPS.addArmF(af);

        } else if (this.data.armadioFarmaci[itemType][index].quantita > item.quantita) {
          const af: AttivitaFarmaciPresidi = {
            dataOP: new Date(),
            elemento: item.nome,
            elemento_id: itemFP._id,
            operation: "Scarico " + type,
            type: itemType,
            elementotype: itemType,
            qty: (Math.abs(this.data.materiale.quantita - item.quantita)).toString(),
            qtyRes: item.quantita.toString(),
            operator: this.dipendente._id,
            operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            paziente: this.data.paziente._id,
            pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
          };
          await this.AFPS.addArmF(af);
        }

        if (item.note !== undefined && item.note !== null && item.note !== "") {
          const af: AttivitaFarmaciPresidi = {
            dataOP: new Date(),
            elemento: item.nome,
            elemento_id: itemFP._id,
            operation: "Aggiunta nota: " + item.note,
            type: itemType,
            elementotype: itemType,
            qty: "",
            operator: this.dipendente._id,
            operatorName: `${this.dipendente.nome} ${this.dipendente.cognome}`,
            paziente: this.data.paziente._id,
            pazienteName: `${this.data.paziente.nome} ${this.data.paziente.cognome}`,
          };
          await this.AFPS.addArmF(af);
        }

        // Aggiornamento dell'elemento nel farmaciArmadio
        this.data.armadioFarmaci[itemType][index] = item;
        await this.AFS.update(this.data.armadioFarmaci, "").toPromise();

        // Aggiorna le quantità disponibili e occupate nel servizio
        let q = this.qtTemp.valueOf() - this.quantita.valueOf();
        itemFP.quantitaDisponibile = itemFP.quantitaDisponibile + q;
        itemFP.quantitaOccupata = itemFP.quantitaOccupata - q;
      }

      // Aggiorna l'elemento nel servizio corrispondente
      await itemService.update(itemFP);
      this.MS.showMessage("Salvataggio Effettuato");
      this.dialogRef.close(true);

    } catch (error) {
      console.error("Errore durante il salvataggio: ", error);
      this.MS.showMessageError("Errore durante il salvataggio.");
    }
  }





  changeMat(event: any, type: String) {
    const filterValue = event.value;
    if (type.toLowerCase() == 'farmaco') {
      this.farmaciService.getById(filterValue).then((r: Farmaci) => {
        console.log(r);
        this.quantitaMax = r.quantitaDisponibile
      });
    }
    if (type.toLowerCase() == 'presidio') {
      this.presServ.getById(filterValue).then((r: Presidi) => {
        console.log(r);
        this.quantitaMax = r.quantitaDisponibile;
      });
    }
  }


}
