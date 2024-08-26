import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Segnalazione } from '../../models/segnalazione';
import { SegnalazioneService } from '../../service/segnalazione.service';

@Component({
  selector: 'app-dialog-segnalazione',
  templateUrl: './dialog-segnalazione.component.html',
  styleUrls: ['./dialog-segnalazione.component.css']
})
export class DialogSegnalazioneComponent implements OnInit {
  
  
  ticket: number;
  descrizione: string;

  constructor(
    private segnalazioneService: SegnalazioneService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
        dipendente: Dipendenti,
        num: number
    }) {
    this.ticket = data.num;
    this.descrizione = "";
  }


  ngOnInit(): void {
  }

  salva() {
    if (this.descrizione.trim() == "" || this.descrizione == null || this.descrizione == undefined) {
      this.messageService.showMessageError("La descrizione è obbligatoria");
      return;
    }
    var segnalazione = new Segnalazione();
    segnalazione.dataSegnalazione = new Date();
    segnalazione.descrizione = this.descrizione;
    segnalazione.numTicket = this.ticket;
    segnalazione.utente = this.data.dipendente._id;
    segnalazione.utenteNome = this.data.dipendente.cognome + " " + this.data.dipendente.nome;
    segnalazione.segnalato = true;
    segnalazione.risolto = false;
    segnalazione.presoincarico = false;
    segnalazione.status = "Segnalato";
    this.segnalazioneService.addSegnalazione(segnalazione).subscribe({
      next: (response) => {
        console.log('Segnalazione salvata con successo:', response);
        // Aggiungi ulteriori azioni da fare dopo il successo, come reindirizzamenti o messaggi di successo
      },
      error: (err) => {
        console.error('Errore durante il salvataggio della segnalazione:', err);
        this.messageService.showMessageError('Errore durante il salvataggio della segnalazione');
      }
    });
  }
}
