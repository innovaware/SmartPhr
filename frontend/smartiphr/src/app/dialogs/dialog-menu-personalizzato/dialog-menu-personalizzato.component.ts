import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paziente } from '../../models/paziente';
import { CucinaPersonalizzato } from '../../models/cucinaPersonalizzato';
import { PazienteService } from '../../service/paziente.service';
import { MessagesService } from '../../service/messages.service';
import { CucinaPersonalizzatoService } from '../../service/cucinaMenuPersonalizzato.service';
import { ArchivioMenuCucinaPersonalizzatoService } from '../../service/archivioMenuCucinaPersonalizzato.service';
import { ArchivioMenuCucinaPersonalizzato } from '../../models/archivioMenuCucinaPersonalizzato';
import { Settings } from '../../models/settings';
import { SettingsService } from '../../service/settings.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-menu-personalizzato',
  templateUrl: './dialog-menu-personalizzato.component.html',
  styleUrls: ['./dialog-menu-personalizzato.component.css']
})
export class DialogMenuPersonalizzatoComponent implements OnInit {
  minDate: Date = new Date();
  today: Date = new Date();
  minDate2: Date = new Date(this.today.setDate(this.today.getDate() + 1));
  menu: CucinaPersonalizzato;
  paziente: Paziente;
  allPazienti: Observable<Paziente[]>;
  date: Date;
  readOnly: Boolean;
  normaleColazione: Boolean;
  digiunoColazione: Boolean;
  leggeroColazione: Boolean;
  liquidoColazione: Boolean;
  liquidochiaroColazione: Boolean;
  semiliquidoColazione: Boolean;
  personalizzatoColazione: Boolean;
  descrizioneColazione: String;
  normalePranzo: Boolean;
  digiunoPranzo: Boolean;
  leggeroPranzo: Boolean;
  liquidoPranzo: Boolean;
  iposodicoPranzo: Boolean;
  ascoricoPranzo: Boolean;
  liquidochiaroPranzo: Boolean;
  semiliquidoPranzo: Boolean;
  personalizzatoPranzo: Boolean;
  descrizionePranzo: String;
  normaleCena: Boolean;
  digiunoCena: Boolean;
  leggeroCena: Boolean;
  liquidoCena: Boolean;
  liquidochiaroCena: Boolean;
  semiliquidoCena: Boolean;
  iposodicoCena: Boolean;
  ascoricoCena: Boolean;
  personalizzatoCena: Boolean;
  id:String;
  descrizioneCena: String;
  setting: Settings = new Settings();
  constructor(
    public pazienteService: PazienteService,
    public messServ: MessagesService,
    private ArchivioServ: ArchivioMenuCucinaPersonalizzatoService,
    public cucinaServ: CucinaPersonalizzatoService,
    private setServ: SettingsService,
    public dialogRef: MatDialogRef<DialogMenuPersonalizzatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      menu: CucinaPersonalizzato,
      paziente: Paziente,
      add: Boolean,
      readOnly: Boolean
    }) {
    this.date = new Date();
    this.menu = !data.add ? data.menu : new CucinaPersonalizzato();
    //this.allPazienti = [];
    this.paziente = new Paziente();
    if (data.add) {
      this.normaleColazione = false;
      this.digiunoColazione = false;
      this.leggeroColazione = false;
      this.liquidoColazione = false;
      this.liquidochiaroColazione = false;
      this.semiliquidoColazione = false;
      this.personalizzatoColazione = false;
      this.descrizioneColazione = "";
      this.normalePranzo = false;
      this.digiunoPranzo = false;
      this.leggeroPranzo = false;
      this.liquidoPranzo = false;
      this.iposodicoPranzo = false;
      this.ascoricoPranzo = false;
      this.liquidochiaroPranzo = false;
      this.semiliquidoPranzo = false;
      this.personalizzatoPranzo = false;
      this.descrizionePranzo = "";
      this.normaleCena = false;
      this.digiunoCena = false;
      this.leggeroCena = false;
      this.liquidoCena = false;
      this.iposodicoCena = false;
      this.ascoricoCena = false;
      this.liquidochiaroCena = false;
      this.semiliquidoCena = false;
      this.personalizzatoCena = false;
      this.descrizioneCena = "";
    }
    else {

      switch (this.menu.menuColazione) {
        case "normale":
          this.digiunoColazione = false;
          this.leggeroColazione = false;
          this.liquidoColazione = false;
          this.liquidochiaroColazione = false;
          this.semiliquidoColazione = false;
          this.personalizzatoColazione = false;
          this.normaleColazione = true;
          this.menu.menuColazione = "normale";
          break;
        case "digiuno":
          this.normaleColazione = false;
          this.leggeroColazione = false;
          this.digiunoColazione = true;
          this.liquidoColazione = false;
          this.liquidochiaroColazione = false;
          this.semiliquidoColazione = false;
          this.personalizzatoColazione = false;
          this.menu.menuColazione = "digiuno";
          break;
        case "leggero":
          this.digiunoColazione = false;
          this.normaleColazione = false;
          this.leggeroColazione = true;
          this.liquidoColazione = false;
          this.liquidochiaroColazione = false;
          this.semiliquidoColazione = false;
          this.personalizzatoColazione = false;
          this.menu.menuColazione = "leggero";
          break;
        case "liquido":
          this.digiunoColazione = false;
          this.normaleColazione = false;
          this.liquidoColazione = true;
          this.leggeroColazione = false;
          this.liquidochiaroColazione = false;
          this.semiliquidoColazione = false;
          this.personalizzatoColazione = false;
          this.menu.menuColazione = "liquido";
          break;
        case "liquidochiaro":
          this.digiunoColazione = false;
          this.normaleColazione = false;
          this.liquidoColazione = false;
          this.leggeroColazione = false;
          this.semiliquidoColazione = false;
          this.personalizzatoColazione = false;
          this.menu.menuColazione = "liquidochiaro";
          this.liquidochiaroColazione = true;
          break;
        case "semiliquido":
          this.digiunoColazione = false;
          this.normaleColazione = false;
          this.liquidoColazione = false;
          this.leggeroColazione = false;
          this.liquidochiaroColazione = false;
          this.semiliquidoColazione = true;
          this.personalizzatoColazione = false;
          this.menu.menuColazione = "semiliquido";
          break;
        case "personalizzato":
          this.digiunoColazione = false;
          this.normaleColazione = false;
          this.liquidoColazione = false;
          this.leggeroColazione = false;
          this.semiliquidoColazione = false;
          this.liquidochiaroColazione = false;
          this.menu.menuColazione = "personalizzato";
          this.personalizzatoColazione = true;
          this.descrizioneColazione = this.menu.personalizzatoColazione;
          break;
      }


      switch (this.menu.menuPranzo) {
        case "normale":
          this.digiunoPranzo = false;
          this.leggeroPranzo = false;
          this.liquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.semiliquidoPranzo = false;
          this.personalizzatoPranzo = false;
          this.normalePranzo = true;
          this.menu.menuPranzo = "normale";
          break;
        case "digiuno":
          this.normalePranzo = false;
          this.leggeroPranzo = false;
          this.digiunoPranzo = true;
          this.liquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.semiliquidoPranzo = false;
          this.personalizzatoPranzo = false;
          this.menu.menuPranzo = "digiuno";
          break;
        case "leggero":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.leggeroPranzo = true;
          this.liquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.semiliquidoPranzo = false;
          this.personalizzatoPranzo = false;
          this.menu.menuPranzo = "leggero";
          break;
        case "liquido":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.liquidoPranzo = true;
          this.leggeroPranzo = false;
          this.liquidochiaroPranzo = false;
          this.semiliquidoPranzo = false;
          this.personalizzatoPranzo = false;
          this.menu.menuPranzo = "liquido";
          break;
        case "liquidochiaro":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.liquidoPranzo = false;
          this.leggeroPranzo = false;
          this.semiliquidoPranzo = false;
          this.personalizzatoPranzo = false;
          this.menu.menuPranzo = "liquidochiaro";
          this.liquidochiaroPranzo = true;
          break;
        case "semiliquido":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.liquidoPranzo = false;
          this.leggeroPranzo = false;
          this.liquidochiaroPranzo = false;
          this.semiliquidoPranzo = true;
          this.personalizzatoPranzo = false;
          this.menu.menuPranzo = "semiliquido";
          break;
        case "personalizzato":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.liquidoPranzo = false;
          this.leggeroPranzo = false;
          this.semiliquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.menu.menuPranzo = "personalizzato";
          this.personalizzatoPranzo = true;
          this.descrizionePranzo = this.menu.personalizzatoPranzo;
          break;
        case "iposodico":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.liquidoPranzo = false;
          this.leggeroPranzo = false;
          this.personalizzatoPranzo = false;
          this.ascoricoPranzo = false;
          this.iposodicoPranzo = true;
          this.semiliquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.menu.menuPranzo = "iposodico";
          break;
        case "ascorico":
          this.digiunoPranzo = false;
          this.normalePranzo = false;
          this.ascoricoPranzo = true;
          this.liquidoPranzo = false;
          this.leggeroPranzo = false;
          this.iposodicoPranzo = false;
          this.personalizzatoPranzo = false;
          this.semiliquidoPranzo = false;
          this.liquidochiaroPranzo = false;
          this.menu.menuPranzo = "ascorico";
          break;
      }

      switch (this.menu.menuCena) {
        case "normale":
          this.digiunoCena = false;
          this.leggeroCena = false;
          this.liquidoCena = false;
          this.liquidochiaroCena = false;
          this.semiliquidoCena = false;
          this.personalizzatoCena = false;
          this.normaleCena = true;
          this.menu.menuCena = "normale";
          break;
        case "digiuno":
          this.normaleCena = false;
          this.leggeroCena = false;
          this.digiunoCena = true;
          this.liquidoCena = false;
          this.liquidochiaroCena = false;
          this.semiliquidoCena = false;
          this.personalizzatoCena = false;
          this.menu.menuCena = "digiuno";
          break;
        case "leggero":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.leggeroCena = true;
          this.liquidoCena = false;
          this.liquidochiaroCena = false;
          this.semiliquidoCena = false;
          this.personalizzatoCena = false;
          this.menu.menuCena = "leggero";
          break;
        case "liquido":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.liquidoCena = true;
          this.leggeroCena = false;
          this.liquidochiaroCena = false;
          this.semiliquidoCena = false;
          this.personalizzatoCena = false;
          this.menu.menuCena = "liquido";
          break;
        case "liquidochiaro":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.liquidoCena = false;
          this.leggeroCena = false;
          this.semiliquidoCena = false;
          this.personalizzatoCena = false;
          this.menu.menuCena = "liquidochiaro";
          this.liquidochiaroCena = true;
          break;
        case "semiliquido":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.liquidoCena = false;
          this.leggeroCena = false;
          this.liquidochiaroCena = false;
          this.semiliquidoCena = true;
          this.personalizzatoCena = false;
          this.menu.menuCena = "semiliquido";
          break;
        case "personalizzato":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.liquidoCena = false;
          this.leggeroCena = false;
          this.semiliquidoCena = false;
          this.liquidochiaroCena = false;
          this.menu.menuCena = "personalizzato";
          this.personalizzatoCena = true;
          this.descrizioneCena = this.menu.personalizzatoCena;
          break;
        case "iposodico":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.liquidoCena = false;
          this.leggeroCena = false;
          this.personalizzatoCena = false;
          this.ascoricoCena = false;
          this.iposodicoCena = true;
          this.semiliquidoCena = false;
          this.liquidochiaroCena = false;
          this.menu.menuCena = "iposodico";
          break;
        case "ascorico":
          this.digiunoCena = false;
          this.normaleCena = false;
          this.ascoricoCena = true;
          this.liquidoCena = false;
          this.leggeroCena = false;
          this.iposodicoCena = false;
          this.personalizzatoCena = false;
          this.semiliquidoCena = false;
          this.liquidochiaroCena = false;
          this.menu.menuCena = "ascorico";
          break;
      }


      this.paziente = data.paziente;
      this.readOnly = true;
    }
    this.setServ.getSettings().then((res: Settings) => {
      this.setting = res[0];
    });

  }

  ngOnInit(): void {
    //this.allPazienti = this.pazienteService.getPazientiObservable()
    this.getPazienti();
    this.setServ.getSettings().then((res: Settings) => {
      this.setting = res[0];
    });
  }


  getPazienti() {
    this.allPazienti = this.pazienteService.getPazientiObservable();
  }

  //applyFilter(event: Event) {
  //  const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  //  this.pazienteService.getPazienti().then((result: Paziente[]) => {
  //    this.allPazienti = result.filter(x =>
  //      x.nome.toLowerCase().includes(filterValue) || x.cognome.toLowerCase().includes(filterValue)
  //    );
  //  });
  //}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.allPazienti = this.pazienteService.getPazientiObservable()
      .pipe(
        map(f => f.filter(x =>
        (
          x.nome.toLowerCase().includes(filterValue.toLowerCase()) ||
          x.cognome.toLowerCase().includes(filterValue.toLowerCase())
        )
        ))
      );
  }

  displayFn(patient: Paziente): string {
    console.log(patient);
    if (patient == null || (patient.cognome == "" && patient.nome == "")) {
      console.log("Fungerà?");
      return undefined;
    }
    return patient && patient.nome + ' ' + patient.cognome;
  }

  save() {
    if (!this.paziente || this.paziente._id == undefined) {
      this.messServ.showMessageError("Inserire il paziente");
      return;
    }
    if (
      this.normaleColazione == false &&
      this.digiunoColazione == false &&
      this.leggeroColazione == false &&
      this.liquidoColazione == false &&
      this.liquidochiaroColazione == false &&
      this.semiliquidoColazione == false &&
      this.personalizzatoColazione == false
    ) {

      this.messServ.showMessageError("Inserire almeno una scelta per la Colazione");
      return;
    }
    if (
      this.normalePranzo == false &&
      this.digiunoPranzo == false &&
      this.leggeroPranzo == false &&
      this.ascoricoPranzo == false &&
      this.iposodicoPranzo == false &&
      this.liquidoPranzo == false &&
      this.liquidochiaroPranzo == false &&
      this.semiliquidoPranzo == false &&
      this.personalizzatoPranzo == false
    ) {

      this.messServ.showMessageError("Inserire almeno una scelta per il Pranzo ");
      return;
    }
    if (
      this.normaleCena == false &&
      this.digiunoCena == false &&
      this.leggeroCena == false &&
      this.liquidoCena == false &&
      this.ascoricoCena == false &&
      this.iposodicoCena == false &&
      this.liquidochiaroCena == false &&
      this.semiliquidoCena == false &&
      this.personalizzatoCena == false
    ) {

      this.messServ.showMessageError("Inserire almeno una scelta per la Cena");
      return;
    }
    if (this.descrizionePranzo == "" && this.personalizzatoPranzo) {
      this.messServ.showMessageError("Inserire nota menu personalizzato Pranzo");
      return;
    }
    if (this.descrizioneColazione == "" && this.personalizzatoColazione) {
      this.messServ.showMessageError("Inserire nota menu personalizzato Colazione");
      return;
    }
    if (this.descrizioneCena == "" && this.personalizzatoCena) {
      this.messServ.showMessageError("Inserire nota menu personalizzato Cena");
      return;
    }

    if (this.menu.dataInizio == undefined || this.menu.dataInizio == null) {
      this.messServ.showMessageError("Inserire Data Inizio menu Personalizzato");
      return;
    }
    if (this.menu.dataFine == undefined || this.menu.dataFine == null) {
      this.messServ.showMessageError("Inserire Data Fine menu Personalizzato");
      return;
    }

    if (this.data.add) {
      console.log("Dentro");
      this.menu.paziente = this.paziente._id;
      this.menu.pazienteName = this.paziente.nome + " " + this.paziente.cognome;
      this.menu.active = true;
      this.menu.dataCreazione = new Date();
      this.menu.personalizzatoColazione = this.descrizioneColazione;
      this.menu.personalizzatoPranzo = this.descrizionePranzo;
      this.menu.personalizzatoCena = this.descrizioneCena;
      //if (this.setting != undefined || this.setting != null) {

      //  console.log("Settings");
      //  if (this.setting.ScadenzaPersonalizzato.valueOf() > 0) {
      //    console.log("Scandenza");
      //    this.menu.dataScadenza = new Date();
      //    this.menu.dataScadenza.setDate(this.menu.dataScadenza.getDate() + this.setting.ScadenzaPersonalizzato.valueOf());
      //  }
      //}
      let temp: CucinaPersonalizzato;
      this.cucinaServ.getActiveByPaziente(this.paziente._id).subscribe((x) => {
        temp = x[0];
        if (temp) {
          temp.active = false;
          this.cucinaServ.Update(temp).subscribe();
      }
      });
      this.cucinaServ.Insert(this.menu).subscribe();
    }
    else {
      this.menu.personalizzatoColazione = this.descrizioneColazione;
      this.menu.personalizzatoPranzo = this.descrizionePranzo;
      this.menu.personalizzatoCena = this.descrizioneCena;
      this.cucinaServ.Update(this.menu).subscribe();
    }

    this.messServ.showMessage("Salvataggio Effettuato");
    this.dialogRef.close();
  }


  Change(obj: String) {
    switch (obj) {
      case "normale":
        this.digiunoColazione = false;
        this.leggeroColazione = false;
        this.liquidoColazione = false;
        this.liquidochiaroColazione = false;
        this.semiliquidoColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "normale";
        break;
      case "digiuno":
        this.normaleColazione = false;
        this.leggeroColazione = false;
        this.liquidoColazione = false;
        this.liquidochiaroColazione = false;
        this.semiliquidoColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "digiuno";
        break;
      case "leggero":
        this.digiunoColazione = false;
        this.normaleColazione = false;
        this.liquidoColazione = false;
        this.liquidochiaroColazione = false;
        this.semiliquidoColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "leggero";
        break;
      case "liquido":
        this.digiunoColazione = false;
        this.normaleColazione = false;
        this.leggeroColazione = false;
        this.liquidochiaroColazione = false;
        this.semiliquidoColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "liquido";
        break;
      case "liquidochiaro":
        this.digiunoColazione = false;
        this.normaleColazione = false;
        this.liquidoColazione = false;
        this.leggeroColazione = false;
        this.semiliquidoColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "liquidochiaro";
        break;
      case "semiliquido":
        this.digiunoColazione = false;
        this.normaleColazione = false;
        this.liquidoColazione = false;
        this.leggeroColazione = false;
        this.liquidochiaroColazione = false;
        this.personalizzatoColazione = false;
        this.menu.menuColazione = "semiliquido";
        break;
      case "personalizzato":
        this.digiunoColazione = false;
        this.normaleColazione = false;
        this.liquidoColazione = false;
        this.leggeroColazione = false;
        this.semiliquidoColazione = false;
        this.liquidochiaroColazione = false;
        this.menu.menuColazione = "personalizzato";
        break;
    }
  }

  ChangeP(obj: String) {
    switch (obj) {
      case "normale":
        this.digiunoPranzo = false;
        this.leggeroPranzo = false;
        this.liquidoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.semiliquidoPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "normale";
        break;
      case "digiuno":
        this.normalePranzo = false;
        this.leggeroPranzo = false;
        this.liquidoPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.semiliquidoPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "digiuno";
        break;
      case "leggero":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.liquidoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.semiliquidoPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "leggero";
        break;
      case "liquido":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.leggeroPranzo = false;
        this.liquidochiaroPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.semiliquidoPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "liquido";
        break;
      case "liquidochiaro":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.liquidoPranzo = false;
        this.leggeroPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.semiliquidoPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "liquidochiaro";
        break;
      case "semiliquido":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.liquidoPranzo = false;
        this.leggeroPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.personalizzatoPranzo = false;
        this.menu.menuPranzo = "semiliquido";
        break;
      case "personalizzato":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.liquidoPranzo = false;
        this.leggeroPranzo = false;
        this.iposodicoPranzo = false;
        this.ascoricoPranzo = false;
        this.semiliquidoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.menu.menuPranzo = "personalizzato";
        break;
      case "iposodico":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.liquidoPranzo = false;
        this.leggeroPranzo = false;
        this.personalizzatoPranzo = false;
        this.ascoricoPranzo = false;
        this.semiliquidoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.menu.menuPranzo = "iposodico";
        break;
      case "ascorico":
        this.digiunoPranzo = false;
        this.normalePranzo = false;
        this.liquidoPranzo = false;
        this.leggeroPranzo = false;
        this.iposodicoPranzo = false;
        this.personalizzatoPranzo = false;
        this.semiliquidoPranzo = false;
        this.liquidochiaroPranzo = false;
        this.menu.menuPranzo = "ascorico";
        break;
    }
  }
  
  ChangeC(obj: String) {
    switch (obj) {
      case "normale":
        this.digiunoCena = false;
        this.leggeroCena = false;
        this.liquidoCena = false;
        this.liquidochiaroCena = false;
        this.semiliquidoCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "normale";
        break;
      case "digiuno":
        this.normaleCena = false;
        this.leggeroCena = false;
        this.liquidoCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.liquidochiaroCena = false;
        this.semiliquidoCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "digiuno";
        break;
      case "leggero":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.liquidoCena = false;
        this.liquidochiaroCena = false;
        this.semiliquidoCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "leggero";
        break;
      case "liquido":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.leggeroCena = false;
        this.liquidochiaroCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.semiliquidoCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "liquido";
        break;
      case "liquidochiaro":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.liquidoCena = false;
        this.leggeroCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.semiliquidoCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "liquidochiaro";
        break;
      case "semiliquido":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.liquidoCena = false;
        this.leggeroCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.liquidochiaroCena = false;
        this.personalizzatoCena = false;
        this.menu.menuCena = "semiliquido";
        break;
      case "personalizzato":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.liquidoCena = false;
        this.leggeroCena = false;
        this.iposodicoCena = false;
        this.ascoricoCena = false;
        this.semiliquidoCena = false;
        this.liquidochiaroCena = false;
        this.menu.menuCena = "personalizzato";
        break;
      case "iposodico":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.liquidoCena = false;
        this.leggeroCena = false;
        this.personalizzatoCena = false;
        this.ascoricoCena = false;
        this.semiliquidoCena = false;
        this.liquidochiaroCena = false;
        this.menu.menuCena = "iposodico";
        break;
      case "ascorico":
        this.digiunoCena = false;
        this.normaleCena = false;
        this.liquidoCena = false;
        this.leggeroCena = false;
        this.iposodicoCena = false;
        this.personalizzatoCena = false;
        this.semiliquidoCena = false;
        this.liquidochiaroCena = false;
        this.menu.menuCena = "ascorico";
        break;
    }
  }

}


