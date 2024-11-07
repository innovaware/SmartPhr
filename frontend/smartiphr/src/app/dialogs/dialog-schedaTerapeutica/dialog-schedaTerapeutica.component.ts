import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Segnalazione } from '../../models/segnalazione';
import { SegnalazioneService } from '../../service/segnalazione.service';
import { ItemsArray, SchedaTerapeutica } from '../../models/schedaTerapeutica';
import { Paziente } from '../../models/paziente';
import { SchedaTerapeuticaService } from '../../service/schedaTerapeutica.service';

@Component({
  selector: 'app-dialog-segnalazione',
  templateUrl: './dialog-schedaTerapeutica.component.html',
  styleUrls: ['./dialog-schedaTerapeutica.component.css']
})
export class DialogSchedaTerapeuticaComponent implements OnInit {


  element: ItemsArray;
  hourTextMap = {
    7: 'sette',
    8: 'otto',
    10: 'dieci',
    12: 'dodici',
    16: 'sedici',
    17: 'diciassette',
    18: 'diciotto',
    20: 'venti',
    22: 'ventidue',
    23: 'ventitre'
  };

  maxDate: String;
  minDate: String;
  constructor(
    private dialogRef: MatDialogRef<DialogSchedaTerapeuticaComponent>,
    private schedaServ: SchedaTerapeuticaService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      scheda: SchedaTerapeutica,
      paziente: Paziente,
      type: String,
      id: String,
      edit: Boolean,
      item: ItemsArray
    }) {
    this.element = new ItemsArray();
    if (data.edit) {
      this.element = data.item;
    }
    this.maxDate = new Date().toISOString().split('T')[0];
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit(): void {
  }

  async salva() {
    try {
      let scheda: SchedaTerapeutica = this.data.scheda;
      if (!this.element.DataInizio) {
        this.messageService.showMessage("Inserire la data inizio terapia");
        return;
      }
      if (!this.element.Terapia || this.element.Terapia.trim() == "") {
        this.messageService.showMessage("Inserire la terapia");
        return;
      }
      if (!this.data.edit) {
        if (!scheda || Object.keys(scheda).length === 0) {
          console.log("Nuova scheda");
          scheda = new SchedaTerapeutica();
          scheda.idPaziente = this.data.id;
          scheda.Orale = [];
          scheda.IMEVSC = [];
          scheda.Estemporanea = [];

          this.addElementToScheda(scheda, this.data.type, this.element);
          

          await this.schedaServ.add(scheda);
          this.messageService.showMessage("Salvataggio Effettuato");
        } else {
          this.addElementToScheda(scheda, this.data.type, this.element);
          await this.schedaServ.update(scheda).toPromise();
          this.messageService.showMessage("Salvataggio Effettuato");
        }
      } else {
        this.editExistingElement(scheda, this.data.type, this.data.item, this.element);
        await this.schedaServ.update(scheda).toPromise();
        this.messageService.showMessage("Modifica Effettuata");
      }
      this.dialogRef.close('risultato');
    } catch (error) {
      console.error("Errore durante il salvataggio della scheda:", error);
    }
  }

  private addElementToScheda(scheda: SchedaTerapeutica, type: String, element: any) {
    switch (type) {
      case "orale":
        scheda.Orale.push(element);
        break;
      case "IMEVSC":
        scheda.IMEVSC.push(element);
        break;
      case "estemporanea":
        scheda.Estemporanea.push(element);
        break;
      default:
        console.warn(`Tipo sconosciuto: ${type}`);
    }
  }

  private editExistingElement(scheda: SchedaTerapeutica, type: String, item: any, element: any) {
    let index: number;
    switch (type) {
      case "orale":
        index = scheda.Orale.indexOf(item);
        if (index !== -1) scheda.Orale[index] = element;
        break;
      case "IMEVSC":
        index = scheda.IMEVSC.indexOf(item);
        if (index !== -1) scheda.IMEVSC[index] = element;
        break;
      case "estemporanea":
        index = scheda.Estemporanea.indexOf(item);
        if (index !== -1) scheda.Estemporanea[index] = element;
        break;
      default:
        console.warn(`Tipo sconosciuto: ${type}`);
    }
  }

}
