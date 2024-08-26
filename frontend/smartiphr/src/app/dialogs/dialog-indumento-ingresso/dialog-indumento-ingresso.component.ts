import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paziente } from 'src/app/models/paziente';
import { MessagesService } from 'src/app/service/messages.service';
import { IndumentiService } from 'src/app/service/indumenti.service';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { Indumento } from '../../models/indumento';
import { IndumentiIngresso } from '../../models/indumentiIngresso';
import { IndumentiIngressoService } from '../../service/indumentiIngresso.service';

@Component({
  selector: 'app-dialog-indumento-ingresso',
  templateUrl: './dialog-indumento-ingresso.component.html',
  styleUrls: ['./dialog-indumento-ingresso.component.css']
})
export class DialogIndumentiIngressoComponent implements OnInit {

  selectedAddingIndumento: string = "";
  selectedQtaIndumento: number;
  note: string;
  conforme: Boolean;
  noninelenco: Boolean;
  richiesto: Boolean;
  indumenti: Indumento[];
  ingresso: IndumentiIngresso;
  enablenote: Boolean = false;
  enableconf: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogIndumentiIngressoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
    },
    private authenticationService: AuthenticationService,
    private dipendentiService: DipendentiService,
    private indumentiService: IndumentiService,
    private indumentiIngressoService: IndumentiIngressoService,
    private messageService: MessagesService
  ) {
    this.reset();
    this.indumenti = [];
    // this.data = injectedData; // Initialize data with injected data
    this.indumentiService.getIndumenti().subscribe((result) => {
      this.indumenti = result;
    });
    this.ingresso = new IndumentiIngresso();
  }
  reset() {
    this.selectedAddingIndumento = "";
    this.selectedQtaIndumento = 0;
    this.conforme = false;
    this.richiesto = false;
    this.noninelenco = false;
    this.enablenote = false;
    this.enableconf = false;
    this.note = "";
  }
  ngOnInit(): void {

  }

  AddIndumento() {
    if (this.selectedAddingIndumento != "" && this.selectedAddingIndumento != null && this.selectedAddingIndumento != undefined) {
      this.ingresso.indumento = this.selectedAddingIndumento.split('/')[0];
      this.ingresso.nome = this.selectedAddingIndumento.split('/')[1];
    }
    if (this.selectedQtaIndumento == 0 || this.selectedQtaIndumento == null || this.selectedQtaIndumento == undefined) {
      this.messageService.showMessageError("La quantità è Obbligatoria!");
      return;
    }
    this.ingresso.quantita = this.selectedQtaIndumento;
    this.ingresso.note = this.note;
    this.ingresso.conforme = this.conforme;
    this.ingresso.dataCaricamento = new Date();
    this.ingresso.noninelenco = this.noninelenco;
    this.ingresso.richiesto = this.richiesto;
    this.ingresso.paziente = this.data.paziente._id;
    this.ingresso.nomePaziente = this.data.paziente.nome + " " + this.data.paziente.cognome;
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      this.dipendentiService.getById(user.dipendenteID).then((dip) => {
        this.ingresso.operatore = user.dipendenteID;
        this.ingresso.nomeOperatore = dip.nome + " " + dip.cognome;
      });
    });
    this.indumentiIngressoService.addIndumentiIngresso(this.ingresso).subscribe(
      (result) => {
        this.messageService.showMessage("Aggiunto indumento in entrata!");
      },
      (error) => {
        this.messageService.showMessageError("Errore inserimento indumento!");
        console.error('Error adding Indumenti Ingresso:', error);
      }
    );

  }
  change() {
    this.selectedAddingIndumento = "";
    this.selectedQtaIndumento = 0;
    this.conforme = false;
    this.richiesto = false;
    this.enableconf = false;
    this.note = "";
    this.enablenote = this.noninelenco;
  }
  changemi() {
    this.enableconf = this.richiesto;
  }
}
