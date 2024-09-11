import { Component, Inject, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Segnalazione } from '../../models/segnalazione';
import { SegnalazioneService } from '../../service/segnalazione.service';
import { AgendaClinica } from '../../models/agendaClinica';
import { AgendaClinicaService } from '../../service/agendaClinica.service';
import { Paziente } from '../../models/paziente';
import { PazienteService } from '../../service/paziente.service';
import { Evento } from '../../models/evento';
import { EventiService } from '../../service/eventi.service';

@Component({
  selector: 'app-dialog-agendaClinica',
  templateUrl: './dialog-agendaClinica.component.html',
  styleUrls: ['./dialog-agendaClinica.component.css']
})
export class DialogAgendaClinicaComponent implements OnInit {

  AllPazienti: Paziente[];
  PazienteSelect: Paziente;
  PazienteName: String;
  dataEvento: Date;
  note: String;
  stato: String;
  tipo: String;
  evento: String;
  add: Boolean;
  enabled: Boolean;
  time: string;  // Usa stringa per l'input di tempo

  constructor(
    private agendaClinicaService: AgendaClinicaService,
    private pazienteService: PazienteService,
    private messageService: MessagesService,
    private eventService: EventiService,
    @Inject(MAT_DIALOG_DATA)
    public data: { dipendente: Dipendenti, item: AgendaClinica, add: Boolean }
  ) {
    this.AllPazienti = [];
    this.add = data.add;
    if (!data.add) {
      this.PazienteName = data.item.pazienteName;
      this.note = data.item.note;
      this.stato = data.item.status;
      this.tipo = data.item.tipo;
      this.evento = data.item.evento;
      this.dataEvento = data.item.dataEvento;
      if (this.dataEvento) {
        const hours = this.dataEvento.getHours().toString().padStart(2, '0');
        const minutes = this.dataEvento.getMinutes().toString().padStart(2, '0');
        this.time = `${hours}:${minutes}`;
      }
      this.enabled = this.stato === 'Visita fissata con data';
    } else {
      this.note = '';
      this.stato = '';
      this.tipo = '';
      this.evento = '';
      this.enabled = false;
      this.time = `00:00`;
    }
    this.getPazienti();
  }

  ngOnInit(): void {
    this.getPazienti();
  }

  getPazienti() {
    this.pazienteService.getPazienti().then(
      (result: Paziente[]) => {
        this.AllPazienti = result;
      }
    );
  }

  salva() {
    if (this.add) {
      if (!this.tipo || this.tipo.trim() === '') {
        this.messageService.showMessageError('La tipologia dell\'evento è obbligatoria');
        return;
      }
      if (!this.PazienteSelect) {
        this.messageService.showMessageError('Inserire il paziente');
        return;
      }
      const item = new AgendaClinica();
      item.paziente = this.PazienteSelect._id;
      item.pazienteName = `${this.PazienteSelect.cognome} ${this.PazienteSelect.nome}`;
      item.note = this.note;
      item.tipo = this.tipo;
      item.evento = this.evento;
      if (this.dataEvento) {
        item.dataEvento = this.dataEvento;
        if (this.time && this.time != null && this.time != undefined) {
          const [hours, minutes] = this.time.split(':').map(Number);
          item.dataEvento.setHours(hours);
          item.dataEvento.setMinutes(minutes);
        }
        var event = new Evento();
        event.tipo = "agendaClinica";
        event.data = this.dataEvento;
        event.dataCreazione = this.dataEvento;
        event.descrizione = item.pazienteName + ": " + this.tipo;
        event.visibile = true;
        this.eventService.insertEvento(event);
      }
      item.status = this.stato;
      this.agendaClinicaService.insertAgendaClinica(item);
    } else {
      const item = this.data.item;
      item.note = this.note;
      if (this.dataEvento) {
        item.dataEvento = this.dataEvento;
        var event = new Evento();
        event.tipo = "agendaClinica";
        event.data = this.dataEvento;
        event.dataCreazione = this.dataEvento;
        event.descrizione = item.pazienteName + ": " + this.tipo;
        event.visibile = true;
        this.eventService.insertEvento(event);
      }
      item.status = this.stato;
      this.agendaClinicaService.updateAgendaClinica(item);
    }
    window.location.href = "/agenda_clinica";
    window.location.reload();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.pazienteService.getPazienti().then((result: Paziente[]) => {
      this.AllPazienti = result.filter(x =>
        x.nome.toLowerCase().includes(filterValue) || x.cognome.toLowerCase().includes(filterValue)
      );
    });
  }

  displayFn(paziente: Paziente): string {
    return paziente ? `${paziente.nome} ${paziente.cognome}` : '';
  }

  onSelectionChange() {
    if (this.tipo === 'Uscita con familiari'
      || this.tipo === 'Accesso C.S.M. (Centro Salute Mentale)'
      || this.tipo === 'Uscita per attività all\'aperto'
      || this.tipo === 'Uscita per visita esterna'
      || this.tipo === 'Uscita per esame'
    ) {
      this.enabled = true;
      this.stato = 'Visita fissata con data';
    }
    else {
      this.stato = '';
      this.enabled = false;
    }

    if (this.stato == 'Visita fissata con data') {
      this.enabled = true;
    }
    else {
      this.enabled = false;
    }
  }
}
