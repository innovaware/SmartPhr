import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paziente } from 'src/app/models/paziente';
import { MessagesService } from 'src/app/service/messages.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Dipendenti } from '../../models/dipendenti';
import { Carrello } from '../../models/carrello';
import { CarrelloItem } from '../../models/carrelloItem';
import { PazienteService } from '../../service/paziente.service';
import { ArmadioFarmaci } from '../../models/armadioFarmaci';
import { ArmadioFarmaciService } from '../../service/armadioFarmaci.service';
import { ItemCartMat } from '../../models/itemArmCart';
import { CarrelloService } from '../../service/carrello.service';
import { RegistroCarrelloService } from '../../service/registroCarrello.service';
import { RegistroCarrello } from '../../models/registroCarrello';
import { AttivitaFarmaciPresidi } from '../../models/attivitaFarmaciPresidi';
import { AttivitafarmacipresidiService } from '../../service/attivitafarmacipresidi.service';

@Component({
  selector: 'app-dialog-cart-item',
  templateUrl: './dialog-cart-item.component.html',
  styleUrls: ['./dialog-cart-item.component.css']
})
export class DialogCartItemComponent implements OnInit {

  MaterialList: ItemCartMat[];
  materiale: String;
  AllPazienti: Paziente[];
  quantita: Number;
  note: String;
  paziente: Paziente;
  material: ItemCartMat;
  constructor(
    private AFPS: AttivitafarmacipresidiService,
    private messageService: MessagesService,
    private PS: PazienteService,
    private CServ: CarrelloService,
    private aF: ArmadioFarmaciService,
    private RegServ: RegistroCarrelloService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      carrello: Carrello,
      elemento: CarrelloItem,
      edit: Boolean,
      type: String,
      dipendente: Dipendenti
    }) {
    this.material = new ItemCartMat();
    this.material.quantita = 0;
    this.AllPazienti = [];
    this.paziente = new Paziente();
    this.quantita = 0;
    this.note = "";
    if (data.edit) {
      this.materiale = data.elemento.elementoName;
      this.quantita = data.elemento.quantita;
      this.note = data.elemento.note;
      if (data.type.toLowerCase() == "infermieri")
        this.PS.getPaziente(data.elemento.pazienteID.valueOf()).then((result: Paziente) => {
          this.paziente = result[0];
        });
    }
    if (data.type.toLowerCase() == 'infermieri') {
      this.loadPazienti();
    }
  }


  ngOnInit(): void {
  }

  async salva() {
    // Se è un nuovo elemento
    if (!this.data.edit) {
      let item: CarrelloItem = new CarrelloItem();

      // Se il carrello è di tipo OSS
      if (this.data.carrello.type.toLowerCase() === 'oss') {
        item.elementoName = this.materiale;
        item.elementoType = "oss";
        item.note = this.note;
        item.quantita = this.quantita;
        console.log(this.quantita);

        // Inizializza il contenuto se non esiste
        if (!this.data.carrello.contenuto || this.data.carrello.contenuto.length === 0) {
          this.data.carrello.contenuto = [];
        }

        // Aggiungi l'elemento al carrello
        this.data.carrello.contenuto.push(item);

        // Aggiorna il carrello
        await this.CServ.update(this.data.carrello).toPromise();

        // Aggiungi al registro
        let reg: RegistroCarrello = new RegistroCarrello();
        reg.carrelloID = this.data.carrello._id;
        reg.carrelloName = this.data.carrello.nomeCarrello;
        reg.dataModifica = new Date();
        reg.elemento = this.materiale;
        reg.type = "OSS";
        reg.operation = "Inserimento materiale";
        reg.quantita = this.quantita;
        reg.operator = this.data.dipendente._id;
        reg.operatorName = `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`;
        await this.RegServ.add(reg);
      }

      // Se il carrello è di tipo infermieri
      if (this.data.carrello.type.toLowerCase() === 'infermieri') {
        if (this.quantita > this.material.quantita) {
          this.messageService.showMessageError("Hai superato la quantità massima");
          return;
        }
        item.elementoName = this.material.elemento;
        item.elementoID = this.material.elementoID;
        item.elementoType = this.material.type;
        item.note = this.note;
        item.quantita = this.quantita;
        console.log(this.quantita);

        // Inizializza il contenuto se non esiste
        if (!this.data.carrello.contenuto || this.data.carrello.contenuto.length === 0) {
          this.data.carrello.contenuto = [];
        }

        // Aggiungi l'elemento al carrello
        this.data.carrello.contenuto.push(item);

        // Aggiorna il carrello
        await this.CServ.update(this.data.carrello).toPromise();

        // Aggiungi al registro
        let reg: RegistroCarrello = new RegistroCarrello();
        reg.carrelloID = this.data.carrello._id;
        reg.carrelloName = this.data.carrello.nomeCarrello;
        reg.dataModifica = new Date();
        reg.elemento = this.materiale;
        reg.type = "Infermieri";
        reg.operation = "Inserimento materiale";
        reg.quantita = this.quantita;
        reg.operator = this.data.dipendente._id;
        reg.operatorName = `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`;
        reg.paziente = this.paziente._id;
        reg.pazienteName = `${this.paziente.nome} ${this.paziente.cognome}`;
        await this.RegServ.add(reg);

        let arm: ArmadioFarmaci = await this.aF.getByPaziente(this.paziente._id);
        if (this.material.type == "Farmaci") {
          arm.farmaci.forEach(async x => {
            if (x.farmacoID == this.material.elemento) {
              x.quantita = x.quantita.valueOf() - this.quantita.valueOf();
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: this.material.elemento,
                elemento_id: this.material.elemento,
                operation: "Scarico Farmaco",
                type: "Farmaci",
                elementotype: "Farmaci",
                qty: (Math.abs(x.quantita.valueOf() - this.quantita.valueOf())).toString(),
                qtyRes: x.quantita.toString(),
                operator: this.data.dipendente._id,
                operatorName: `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`,
                paziente: this.paziente._id,
                pazienteName: `${this.paziente.nome} ${this.paziente.cognome}`,
              };
              await this.AFPS.addArmF(af);
            }
          });
          await this.aF.update(arm,"").toPromise();
        }
        if (this.material.type == "Presidi") {
          arm.presidi.forEach(async x => {
            if (x.presidioID == this.material.elemento) {
              x.quantita = x.quantita.valueOf() - this.quantita.valueOf();
              const af: AttivitaFarmaciPresidi = {
                dataOP: new Date(),
                elemento: this.material.elemento,
                elemento_id: this.material.elemento,
                operation: "Scarico Presidio",
                type: "Presidi",
                elementotype: "Presidi",
                qty: (Math.abs(x.quantita.valueOf() - this.quantita.valueOf())).toString(),
                qtyRes: x.quantita.toString(),
                operator: this.data.dipendente._id,
                operatorName: `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`,
                paziente: this.paziente._id,
                pazienteName: `${this.paziente.nome} ${this.paziente.cognome}`,
              };
              await this.AFPS.addArmF(af);
            }
          });
          await this.aF.update(arm, "").toPromise();
        }

      }
    }
    // Se si sta modificando un elemento esistente
    else {
      // Se il carrello è di tipo OSS
      if (this.data.carrello.type.toLowerCase() === 'oss') {
        const q: number = this.quantita.valueOf() - this.data.elemento.quantita.valueOf();
        const index = this.data.carrello.contenuto.indexOf(this.data.elemento);

        // Aggiorna le quantità e le note dell'elemento
        this.data.carrello.contenuto[index].quantita = this.quantita;
        this.data.carrello.contenuto[index].note = this.note;

        // Aggiorna il carrello
        await this.CServ.update(this.data.carrello).toPromise();

        // Aggiungi al registro
        let reg: RegistroCarrello = new RegistroCarrello();
        reg.carrelloID = this.data.carrello._id;
        reg.carrelloName = this.data.carrello.nomeCarrello;
        reg.dataModifica = new Date();
        reg.elemento = this.materiale;
        reg.type = "OSS";
        reg.operation = q <= 0 ? "Scarico materiale" : "Carico materiale";
        reg.quantita = Math.abs(q);
        reg.quantitaRes = this.quantita;
        reg.operator = this.data.dipendente._id;
        reg.operatorName = `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`;
        await this.RegServ.add(reg);
      }

      // Se il carrello è di tipo infermieri
      if (this.data.carrello.type.toLowerCase() === 'infermieri') {

      }
    }
  }

  async loadPazienti() {
    try {
      const res: Paziente[] = await this.PS.getPazienti();
      const pazientiConFarmaci = await Promise.all(
        res.map(async (x) => {
          const afres: ArmadioFarmaci[] = await this.aF.get();
          const hasFarmaci = afres.some(y => y.pazienteId === x._id);
          return hasFarmaci ? x : null;
        })
      );

      this.AllPazienti = pazientiConFarmaci.filter(x => x !== null);
    } catch (error) {
      console.error("Errore durante il caricamento dei pazienti", error);
    }
  }

  change(selectedPaziente) {
    console.log("Evento optionSelected attivato");
    console.log("Paziente selezionato:", selectedPaziente);  // Log per verificare il valore del paziente

    // Resetta la lista dei materiali ogni volta che cambia il paziente selezionato
    this.MaterialList = [];

    // Verifica se selectedPaziente è popolato correttamente
    if (selectedPaziente && selectedPaziente._id) {
      console.log("ID paziente valido:", selectedPaziente._id);

      this.aF.getByPaziente(selectedPaziente._id).then((res: ArmadioFarmaci) => {
        console.log("Risposta dall'API:", res);  // Log per vedere la risposta dall'API

        if (res) {
          const armF: ArmadioFarmaci = res[0];
          armF.farmaci.forEach(x => {
            let item: ItemCartMat = new ItemCartMat();
            item.elementoID = x.farmacoID;
            item.elemento = x.nome;
            item.quantita = x.quantita;
            item.type = "Farmaci";
            this.MaterialList.push(item);
          });

          armF.presidi.forEach(x => {
            let item: ItemCartMat = new ItemCartMat();
            item.elementoID = x.presidioID;
            item.elemento = x.nome;
            item.quantita = x.quantita;
            item.type = "Presidi";
            this.MaterialList.push(item);
          });

          console.log("Lista dei materiali aggiornata:", this.MaterialList);  // Log finale
        } else {
          console.warn("Nessun armadio farmaci trovato per il paziente selezionato.");
        }
      }).catch(err => {
        console.error("Errore nel recupero dell'armadio farmaci: ", err);
      });
    } else {
      console.warn("Paziente non valido selezionato.");
    }
  }


  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    try {
      const res: Paziente[] = await this.PS.getPazienti();
      const pazientiConFarmaci = await Promise.all(
        res.map(async (x) => {
          const afres: ArmadioFarmaci[] = await this.aF.get();
          const hasFarmaci = afres.some(y => y.pazienteId === x._id);
          return hasFarmaci ? x : null;
        })
      );

      this.AllPazienti = pazientiConFarmaci.filter(x => x !== null && (x.nome.toLowerCase().includes(filterValue) || x.cognome.toLowerCase().includes(filterValue)));
    } catch (error) {
      console.error("Errore durante il caricamento dei pazienti", error);
    }

  }

  async applyMaterialFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.MaterialList = this.MaterialList.filter(x => x.elemento.toLowerCase().includes(filterValue));
  }

  // Definisci la funzione displayFn nel componente
  displayFn(paziente: Paziente): string {
    return paziente && paziente.nome && paziente.cognome ? `${paziente.nome} ${paziente.cognome}` : '';
  }
  // Definisci la funzione displayFn nel componente
  displayMaterialFn(material: ItemCartMat): string {
    return material && material.elemento ? `${material.elemento} - ${material.type}` : '';
  }


}
