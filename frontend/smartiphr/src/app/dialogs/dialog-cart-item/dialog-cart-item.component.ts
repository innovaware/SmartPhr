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
import { Farmaci } from '../../models/farmaci';
import { FarmacoArmadio } from '../../models/armadioFarmaciPresidi';

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
  nomePaziente: String;
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
    }
  ) {
    this.initializeDefaults();

    if (data.edit) {
      this.setupEditData();
    }

    if (data.type.toLowerCase() === 'infermieri') {
      this.loadPazienti();
    }
  }

  private initializeDefaults(): void {
    this.nomePaziente = '';
    this.material = new ItemCartMat();
    this.material.quantita = 0;
    this.AllPazienti = [];
    this.paziente = new Paziente();
    this.quantita = 0;
    this.note = '';
  }

  private setupEditData(): void {
    const { elemento, type } = this.data;

    this.materiale = elemento.elementoName;
    this.quantita = elemento.quantita;
    this.note = elemento.note;

    if (type.toLowerCase() === 'infermieri') {
      this.loadPazienteData(elemento.pazienteID.valueOf(), elemento.elementoType.valueOf(), elemento.elementoID.valueOf());
    }
  }

  private loadPazienteData(pazienteID: string, elementoType: string, elementoID: string): void {
    this.PS.getPaziente(pazienteID).then((result: Paziente) => {
      this.paziente = result[0];
      this.nomePaziente = `${this.paziente.nome} ${this.paziente.cognome}`;

      this.aF.getByPaziente(this.paziente._id).then((res: ArmadioFarmaci) => {
        const armF = res[0];
        if (elementoType === 'Farmaci') {
          this.assignMaterialFromList(armF.farmaci, elementoID, 'Farmaci');
        } else if (elementoType === 'Presidi') {
          this.assignMaterialFromList(armF.presidi, elementoID, 'Presidi');
        }
      });
    });
  }

  private assignMaterialFromList(list: any[], elementoID: string, type: string): void {
    list.forEach(item => {
      if ((type === 'Farmaci' && item.farmacoID === elementoID) ||
        (type === 'Presidi' && item.presidioID === elementoID)) {
        this.material = new ItemCartMat();
        this.material.elementoID = type === 'Farmaci' ? item.farmacoID : item.presidioID;
        this.material.elemento = item.nome;
        const n: Number = item.quantita;
        this.material.quantita = Number(n) + Number(this.data.elemento.quantita);
        console.log(this.material.quantita);
        this.material.type = type;
      }
    });
  }



  ngOnInit(): void {
  }

  async salva() {
    try {
      const isOSS = this.data.carrello.type.toLowerCase() === 'oss';
      const isInfermiere = this.data.carrello.type.toLowerCase() === 'infermieri';

      let item: CarrelloItem = new CarrelloItem();

      // Funzione per aggiungere l'elemento al carrello
      const aggiungiElementoAlCarrello = () => {
        if (!this.data.carrello.contenuto || this.data.carrello.contenuto.length === 0) {
          this.data.carrello.contenuto = [];
        }
        this.data.carrello.contenuto.push(item);
      };

      // Funzione per aggiungere al registro
      const aggiungiAlRegistro = async (tipo: string, operazione: string, qRes: number,q:number = 0) => {
        let reg: RegistroCarrello = new RegistroCarrello();
        reg.carrelloID = this.data.carrello._id;
        reg.carrelloName = this.data.carrello.nomeCarrello;
        reg.dataModifica = new Date();
        reg.elemento = isOSS ? this.materiale : this.material.elemento;
        reg.type = tipo;
        reg.operation = operazione;
        reg.quantita = q != 0 ? q : this.quantita;
        reg.quantitaRes = qRes;
        reg.operator = this.data.dipendente._id;
        reg.operatorName = `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`;
        if (isInfermiere) {
          reg.paziente = this.paziente._id;
          reg.pazienteName = `${this.paziente.nome} ${this.paziente.cognome}`;
        }
        await this.RegServ.add(reg);
      };

      // Funzione per gestire farmaci o presidi
      const gestioneScarico = async (armF: ArmadioFarmaci, tipo: string, elementoID: string, qtaRes: number, q: number = 0) => {
        const af: AttivitaFarmaciPresidi = {
          dataOP: new Date(),
          elemento: this.material.elemento,
          elemento_id: elementoID,
          operation: tipo + " " + this.material.type + " dal carrello " + this.data.carrello.nomeCarrello,
          type: this.material.type,
          elementotype: this.material.type,
          qty: q != 0 ? q.toString() : this.quantita.toString(),
          qtyRes: qtaRes.toString(),
          operator: this.data.dipendente._id,
          operatorName: `${this.data.dipendente.nome} ${this.data.dipendente.cognome}`,
          paziente: this.paziente._id,
          pazienteName: `${this.paziente.nome} ${this.paziente.cognome}`,
        };
        await this.AFPS.addArmF(af);
      };

      // Se è un nuovo elemento
      if (!this.data.edit) {
        if (isOSS) {
          // Set OSS-specific item details
          item.elementoName = this.materiale;
          item.elementoType = "oss";
          item.note = this.note;
          item.quantita = this.quantita;
          aggiungiElementoAlCarrello();
          await this.CServ.update(this.data.carrello).toPromise();
          await aggiungiAlRegistro("OSS", "Inserimento materiale", Number(this.quantita));
        }

        if (isInfermiere) {
          if (Number(this.quantita) > Number(this.material.quantita)) {
            this.messageService.showMessageError("Hai superato la quantità massima");
            return;
          }
          // Set infermiere-specific item details
          item.elementoName = this.material.elemento;
          item.elementoID = this.material.elementoID;
          item.elementoType = this.material.type;
          item.note = this.note;
          item.quantita = Number(this.quantita);
          item.pazienteID = this.paziente._id;
          item.pazienteNome = `${this.paziente.nome} ${this.paziente.cognome}`;
          aggiungiElementoAlCarrello();
          await this.CServ.update(this.data.carrello).toPromise();
          await aggiungiAlRegistro("Infermieri", "Inserimento " + this.material.type, Number(this.quantita));

          // Gestione farmaci/presidi
          let arm: ArmadioFarmaci = await this.aF.getByPaziente(this.paziente._id);
          let armF: ArmadioFarmaci = arm[0];
          if (this.material.type == "Farmaci" || this.material.type == "Presidi") {
            for (let x of this.material.type == "Farmaci" ? armF.farmaci : armF.presidi) {
              if (x[this.material.type == "Farmaci" ? 'farmacoID' : 'presidioID'] == this.material.elementoID) {
                x.quantita = Math.max(0, Number(x.quantita) - Number(this.quantita));
                await gestioneScarico(armF, "Scarico", this.material.elementoID.valueOf(), Number(x.quantita));
              }
            }
          }
        }
      }
      // Se si sta modificando un elemento esistente
      else {
        const q: number = this.quantita.valueOf() - this.data.elemento.quantita.valueOf();
        console.log("q= ",q);
        const index = this.data.carrello.contenuto.indexOf(this.data.elemento);

        if (isOSS) {
          this.data.carrello.contenuto[index].quantita = Number(this.quantita);
          this.data.carrello.contenuto[index].note = this.note;
          await this.CServ.update(this.data.carrello).toPromise();
          await aggiungiAlRegistro("OSS", q <= 0 ? "Scarico materiale" : "Carico materiale", Number(this.quantita), Math.abs(q));
        }

        if (isInfermiere) {
          if (Number(this.quantita) > Number(this.material.quantita)) {
            this.messageService.showMessageError("Hai superato la quantità massima");
            return;
          }
          if (Number(this.quantita) <= 0) {
            if (index > -1) {
              this.data.carrello.contenuto.splice(index, 1);
              let reg1: RegistroCarrello = {
                carrelloID: this.data.carrello._id,
                carrelloName: this.data.carrello.nomeCarrello,
                elemento: this.data.elemento.elementoName,
                dataModifica: new Date(),
                type: this.data.carrello.type,
                operator: this.data.dipendente._id,
                operatorName: this.data.dipendente.nome + " " + this.data.dipendente.cognome,
                operation: "Elemento rimosso"
              };
              console.log("Registro: ", reg1);
              await this.RegServ.add(reg1);
            }
            await this.CServ.update(this.data.carrello).toPromise();
            this.messageService.showMessage("Salvataggio effettuato");
            return;
          }
          this.data.carrello.contenuto[index].quantita = Number(this.quantita);
          this.data.carrello.contenuto[index].note = this.note;
          await this.CServ.update(this.data.carrello).toPromise();
          await aggiungiAlRegistro("Infermieri", "Modifica " + this.material.type, Number(this.quantita), Math.abs(q));

          // Gestione farmaci/presidi aggiornati
          let arm: ArmadioFarmaci = await this.aF.getByPaziente(this.paziente._id);
          let armF: ArmadioFarmaci = arm[0];
          console.log(armF);
          if (this.material.type == "Farmaci" || this.material.type == "Presidi") {
            console.log("dentro");
            for (let x of this.material.type == "Farmaci" ? armF.farmaci : armF.presidi) {
              if (x[this.material.type == "Farmaci" ? 'farmacoID' : 'presidioID'] == this.material.elementoID) {
                let y: any = x;
                console.log("dentro ed y= ",y);
                const index = this.material.type == "Farmaci" ? armF.farmaci.indexOf(y) : armF.presidi.indexOf(y);
                x.quantita = Math.abs(Number(x.quantita) - q);// Adjust quantity
                if (Number(x.quantita) < 0) x.quantita = 0;
                console.log("Number(x.quantita) + (q > 0 ? -q : q)", Number(x.quantita) + (q > 0 ? -q : q));
                console.log("index= ", index);
                console.log("quantita mod= ", x.quantita);
                y = x;
                this.material.type == "Farmaci" ? armF.farmaci[index] = y : armF.presidi[index] = y;
                await this.aF.update(armF, "").toPromise();
                await gestioneScarico(armF, "Scarico", this.material.elementoID.valueOf(), Number(x.quantita),Math.abs(q));
              }
            }
          }
        }
      }

      this.messageService.showMessage("Salvataggio effettuato");
    } catch (error) {
      console.error('Errore:', error);
      this.messageService.showMessageError("Errore durante l'operazione");
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
            if (x.quantita.valueOf() > 0) {
              let item: ItemCartMat = new ItemCartMat();
              item.elementoID = x.farmacoID;
              item.elemento = x.nome;
              item.quantita = x.quantita;
              item.type = "Farmaci";
              this.MaterialList.push(item);
            }
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
