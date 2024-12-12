import { Component, OnInit } from '@angular/core';
import { RifiutiSpecialiService } from '../../service/rifiutiSpeciali.service';
import { MessagesService } from '../../service/messages.service';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { Dipendenti } from '../../models/dipendenti';
import { Mese, RifiutiSpeciali } from '../../models/rifiutiSpeciali';
import { DialogQuestionComponent } from '../../dialogs/dialog-question/dialog-question.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rifiuti-speciali',
  templateUrl: './rifiutiSpeciali.component.html',
  styleUrls: ['./rifiutiSpeciali.component.css']
})
export class RifiutiSpecialiComponent implements OnInit {
  // Anno di riferimento
  anni: Number[];
  annoRiferimento: number = new Date().getFullYear();
  dipendente: Dipendenti;
  rifiutiSpeciali: RifiutiSpeciali;
  Find: Boolean;
  mesi: Mese[] = [];
  prev: Boolean;
  next: Boolean;
  today = new Date().toISOString().split('T')[0];
  constructor(
    public dialog: MatDialog,
    private RifServ: RifiutiSpecialiService,
    private messServ: MessagesService,
    private authServ: AuthenticationService,
    private dipendenteServ: DipendentiService,
  ) {
    this.annoRiferimento = new Date().getFullYear();
    this.Find = false;
    this.mesi = [];
    this.anni = [];
    this.prev = true;
    this.next = true;
    this.mesi.push(new Mese("Gennaio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Febbraio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Marzo", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Aprile", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Maggio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Giugno", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Luglio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Agosto", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Settembre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Ottobre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Novembre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Dicembre", '', 0, 0, '', ''));
    this.getRifiuti(this.annoRiferimento);
    this.loadUser();
  }

  ngOnInit() {
    this.mesi = [];
    this.mesi.push(new Mese("Gennaio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Febbraio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Marzo", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Aprile", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Maggio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Giugno", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Luglio", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Agosto", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Settembre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Ottobre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Novembre", '', 0, 0, '', ''));
    this.mesi.push(new Mese("Dicembre", '', 0, 0, '', ''));
    this.getRifiuti(this.annoRiferimento);
  }

  // Metodo per cambiare l'anno, con limite minimo
  cambiaAnno(direzione: number): void {
    const nuovoAnno = this.annoRiferimento + direzione;
    if (nuovoAnno >= 2024) {
      this.annoRiferimento = nuovoAnno;
      this.getRifiuti(nuovoAnno);
    }
  }

  async firmaTurno(row: Mese) {
    const dialogData = {
      data: { message: "Vuoi procedere con la firma?" }
    };
    const index = this.mesi.indexOf(row);
    const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

    if (!result) {
      return;
    }
    if (!row.data) {
      this.messServ.showMessageError("Inserire la data");
      return;
    }

    if (row.rifiutiSpeciali.valueOf() < 0) {
      this.messServ.showMessageError("Non è possibile mettere un numero negativo!");
      return;
    }

    if (row.farmaciScaduti.valueOf() < 0) {
      this.messServ.showMessageError("Non è possibile mettere un numero negativo!");
      return;
    }

    row.firmaIp = this.dipendente.nome + " " + this.dipendente.cognome;
    row.IpId = this.dipendente._id;
    if (index >= 0) {
      this.mesi[index] = row ;
    }

    this.rifiutiSpeciali.mesi = this.mesi;
    if (this.Find) await this.RifServ.save(this.rifiutiSpeciali);
    else await this.RifServ.insert(this.rifiutiSpeciali);
    this.messServ.showMessage("Salvataggio effettuato");
  }

  loadUser() {
    this.dipendente = new Dipendenti();
    this.authServ.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteServ
        .getByIdUser(user.dipendenteID)
        .then((x) => {

          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messServ.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }
  aggiornaStatoFreccia(): void {
    const indiceCorrente = this.anni.indexOf(this.annoRiferimento);
    console.log("Indice corrente: ", indiceCorrente);
    console.log("lunghezza: ", this.anni.length);
    this.prev = indiceCorrente > 0; // True se non è il primo anno
    this.next = indiceCorrente < this.anni.length - 1; // True se non è l'ultimo anno
  }

  async getRifiuti(anno: Number) {
    try {
      // Reset dello stato iniziale
      this.Find = false;
      this.rifiutiSpeciali = new RifiutiSpeciali(this.annoRiferimento, this.mesi);

      // Recupero dei rifiuti speciali per anno
      const risultatiAnno = await this.RifServ.getByYear(anno);
      if (risultatiAnno) {
        this.rifiutiSpeciali = risultatiAnno[0];
        this.mesi = this.rifiutiSpeciali.mesi;
        this.Find = true;
      }


      // Recupero di tutti gli anni disponibili
      const tuttiRifiuti = await this.RifServ.get();
      const anniDisponibili = tuttiRifiuti.map(y => y.anno);

      // Aggiornamento della lista degli anni
      if (!anniDisponibili.includes(this.annoRiferimento)) {
        anniDisponibili.push(this.annoRiferimento);
      }

      this.anni = anniDisponibili.sort((a: Number, b: Number) => a.valueOf() - b.valueOf());

      this.aggiornaStatoFreccia();
      // Debug: verifica degli anni aggiornati
      console.log("Anni: ", this.anni);
    } catch (error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  }

  controllaData(row) {
    const today = new Date();
    if (new Date(row.data) > today) {
      alert('Non puoi selezionare una data futura!');
      row.data = null;
    }
  }

}
