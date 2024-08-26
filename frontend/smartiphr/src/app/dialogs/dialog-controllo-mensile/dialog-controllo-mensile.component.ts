import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegnalazioneService } from '../../service/segnalazione.service';
import { controllomensile } from '../../models/controllomensile';
import { ControlloMensileService } from '../../service/controllomensile.service';

@Component({
  selector: 'app-dialog-controllo-mensile',
  templateUrl: './dialog-controllo-mensile.component.html',
  styleUrls: ['./dialog-controllo-mensile.component.css']
})
export class DialogControlloMensileComponent implements OnInit {
  
  
  note: string;
  dataControllo: Date;
  esito: Boolean;
  tipologia: String;
  constructor(
    private controlloMensileService: ControlloMensileService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
        dipendente: Dipendenti
    }) {
    this.dataControllo = new Date();
    this.note = "";
    this.esito = false;
    this.tipologia = "";
  }


  ngOnInit(): void {
  }

  salva() {
    if ((this.note.trim() == "" || this.note == null || this.note == undefined) && !this.esito) {
      this.messageService.showMessageError("Giustificare l'esito negativo");
      return;
    }
    if ((this.tipologia.trim() == "" || this.tipologia == null || this.tipologia == undefined)) {
      this.messageService.showMessageError("Inserire la tipologia");
      return;
    }
    var controlloMensile = new controllomensile();
    controlloMensile.dataControllo = this.dataControllo;
    controlloMensile.note = this.note;
    controlloMensile.esitoPositivo = this.esito;
    controlloMensile.utente = this.data.dipendente._id;
    controlloMensile.utenteNome = this.data.dipendente.cognome + " " + this.data.dipendente.nome;
    controlloMensile.tipologia = this.tipologia;
    this.controlloMensileService.add(controlloMensile).subscribe({
      next: (response) => {
        console.log('controlloMensileService salvato con successo:', response);
        // Aggiungi ulteriori azioni da fare dopo il successo, come reindirizzamenti o messaggi di successo
      },
      error: (err) => {
        console.error('Errore durante il salvataggio della controlloMensileService:', err);
        this.messageService.showMessageError('Errore durante il salvataggio della controlloMensileService');
      }
    });
  }
}
