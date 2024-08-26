import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paziente } from '../../models/paziente';
import { CucinaPersonalizzato } from '../../models/cucinaPersonalizzato';
import { PazienteService } from '../../service/paziente.service';
import { MessagesService } from '../../service/messages.service';
import { CucinaPersonalizzatoService } from '../../service/cucinaMenuPersonalizzato.service';
import { ArchivioMenuCucinaPersonalizzatoService } from '../../service/archivioMenuCucinaPersonalizzato.service';
import { ArchivioMenuCucinaPersonalizzato } from '../../models/archivioMenuCucinaPersonalizzato';

@Component({
  selector: 'app-dialog-menu-personalizzato',
  templateUrl: './dialog-menu-personalizzato.component.html',
  styleUrls: ['./dialog-menu-personalizzato.component.css']
})
export class DialogMenuPersonalizzatoComponent implements OnInit {


  menuData: CucinaPersonalizzato[];
  paziente: Paziente;
  allPazienti: Paziente[];
  date: Date;
  readOnly: Boolean;
  constructor(
    public pazienteService: PazienteService,
    public messServ: MessagesService,
    private ArchivioServ: ArchivioMenuCucinaPersonalizzatoService,
    public cucinaServ: CucinaPersonalizzatoService,
    public dialogRef: MatDialogRef<DialogMenuPersonalizzatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      menu: CucinaPersonalizzato[],
      paziente: Paziente,
      add: Boolean,
      readOnly: Boolean
    })
  {
    this.date = new Date();
    this.menuData = [];
    this.allPazienti = [];
    if (!data.add) {
      console.log(data.paziente);
      this.paziente = data.paziente;
      this.readOnly = true;
    }
    else {
      this.paziente = new Paziente();
      this.readOnly = false;
    }
    if (!data.add) this.menuData = data.menu.sort((a, b) => a.giornoRifNum.valueOf() - b.giornoRifNum.valueOf());
    else {
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Domenica",
        giornoRifNum:0,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Lunedì",
        giornoRifNum:1,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Martedì",
        giornoRifNum:2,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Mercoledì",
        giornoRifNum:3,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Giovedì",
        giornoRifNum:4,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Venerdì",
        giornoRifNum:5,
        menuPranzo: "",
        menuSpuntino: ""
      });
      this.menuData.push({
        menuColazione: "",
        dataCreazione: new Date(),
        paziente: "",
        pazienteName: "",
        menuCena: "",
        menuMerenda: "",
        active: true,
        giornoRif: "Sabato",
        giornoRifNum:6,
        menuPranzo: "",
        menuSpuntino: ""
      });
    }
    if (data.readOnly) this.readOnly = true;
    this.getPazienti();
  }

  ngOnInit(): void {
    this.allPazienti = [];
    this.getPazienti();
  }


  getPazienti() {
    this.allPazienti = [];
    this.pazienteService.getPazienti().then(
      (result: Paziente[]) => {
        this.allPazienti = result;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.pazienteService.getPazienti().then((result: Paziente[]) => {
      this.allPazienti = result.filter(x =>
        x.nome.toLowerCase().includes(filterValue) || x.cognome.toLowerCase().includes(filterValue)
      );
    });
  }

  displayFn(paziente: Paziente): string {
    return paziente ? `${paziente.nome} ${paziente.cognome}` : '';
  }

  save() {
    if (!this.paziente || this.paziente._id == undefined) {
      this.messServ.showMessageError("Inserire il paziente");
      return;
    }

    if (this.data.add) {
      this.cucinaServ.getActiveByPaziente(this.paziente._id).subscribe((res: CucinaPersonalizzato[]) => {
        if (res && res.length > 0) {
          res.forEach((x: CucinaPersonalizzato) => {
            console.log("Dentro");
            x.active = false;
            this.cucinaServ.Update(x).subscribe(
              (response) => {
                // Gestisci la risposta qui
                console.log(response);
              });
          });
          let archivio = new ArchivioMenuCucinaPersonalizzato();
          archivio.paziente = this.paziente._id;
          archivio.pazienteCognome = this.paziente.cognome;
          archivio.pazienteNome = this.paziente.nome;
          archivio.menu = res;
          archivio.dataCreazione = res[0].dataCreazione;
          archivio.dataUltimaModifica = res[0].dataUltimaModifica;
          this.ArchivioServ.Insert(archivio).subscribe((response) => {
            console.log(response);
          });
        }
      });
      console.log(this.menuData);
      this.menuData.forEach((x: CucinaPersonalizzato) => {
        x.paziente = this.paziente._id;
        x.pazienteName = this.paziente.nome + " " + this.paziente.cognome;
        this.cucinaServ.Insert(x).subscribe(
          (response) => {
            // Gestisci la risposta qui
          });
      });
    }
    else {
      this.menuData.forEach((x: CucinaPersonalizzato) => {
        this.cucinaServ.Update(x).subscribe(
          (response) => {
            // Gestisci la risposta qui
          });
      });
    }
    this.messServ.showMessage("Salvataggio Effettuato");
  }

}


