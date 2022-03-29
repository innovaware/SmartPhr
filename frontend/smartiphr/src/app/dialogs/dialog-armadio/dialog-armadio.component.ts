import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Armadio } from 'src/app/models/armadio';
import { Paziente } from 'src/app/models/paziente';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
import { ArmadioService } from 'src/app/service/armadio.service';
import { ControlliOSS } from 'src/app/models/controlliOSS';
import { ControlliOSSService } from 'src/app/service/controlli-oss.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/models/user';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { Dipendenti } from 'src/app/models/dipendenti';

@Component({
  selector: 'app-dialog-armadio',
  templateUrl: './dialog-armadio.component.html',
  styleUrls: ['./dialog-armadio.component.css']
})
export class DialogArmadioComponent implements OnInit {


  @ViewChild("paginatorElementoArmadio", {static: false})
  ElementoArmadioPaginator: MatPaginator;
  public nuovoElementoArmadio: Armadio;
  public ElementiArmadioDataSource: MatTableDataSource<Armadio>;
  public elementiArmadio: Armadio[] = [];
  public uploadingElementoArmadio: boolean;
  public addingElementoArmadio: boolean;

  @ViewChild("paginatorAttArmadio", {static: false})
  AttArmadioPaginator: MatPaginator;
  public AttArmadioDataSource: MatTableDataSource<Armadio>;
  public attArmadio: Armadio[] = [];
  public controllo: ControlliOSS;

  paziente: Paziente;
  dipendente: Dipendenti;

  DisplayedColumns: string[] = ["description", "quantity", "note", "action"];
  DisplayedColumnsAtt: string[] = ["description", "operator","date", "quantity", "note"];

  constructor(public dialogRef: MatDialogRef<DialogArmadioComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public armadioService: ArmadioService,
    public controlliOSSService :ControlliOSSService,
    public dataIngressoService: DataIngressoService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    public authenticationService:AuthenticationService,
    public dipendenteService: DipendentiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) {
      this.paziente = Paziente.clone(data.paziente);
      this.controllo = {} as ControlliOSS;
      this.loadUser();
    }

  ngOnInit() {
    this.getElementi();
    this.getAttivita();
    this.getControlliPaziente();
  }


  loadUser(){
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user)=>{
        console.log('get dipendente');
        this.dipendenteService
        .getByIdUser(user._id)
        .then((x) => {
          console.log('dipendente: ' + JSON.stringify(x));
              this.dipendente = x[0];
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
       });
  }



  async addElemento() {
    this.addingElementoArmadio = true;
    this.nuovoElementoArmadio = {
      paziente: this.paziente._id,
      pazienteName: this.paziente.nome + ' '+ this.paziente.cognome,
      operator: this.paziente._id,
      operatorName: this.paziente.nome + ' '+ this.paziente.cognome,
      elemento: "",
      note: "",
      quantita: 0,
    };
  }


  async save(model: Armadio) {
    console.log("Insert ElementoArmadio: ", model);
    this.armadioService
      .insert(model)
      .then((result: Armadio) => {
        console.log("Insert ElementoArmadio: ", result);
        this.elementiArmadio.push(result);
        this.ElementiArmadioDataSource.data = this.elementiArmadio;
        this.addingElementoArmadio = false;
        this.uploadingElementoArmadio = false;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento ElementoArmadio");
        console.error(err);
      });
  }

  async getElementi() {
    console.log(`get ElementiArmadio paziente: ${this.paziente._id}`);
    this.armadioService
      .getElementiByPaziente(this.paziente._id)
      .then((f: Armadio[]) => {
        this.elementiArmadio = f;

        this.ElementiArmadioDataSource = new MatTableDataSource<Armadio>(
          this.elementiArmadio
        );
        this.ElementiArmadioDataSource.paginator = this.ElementoArmadioPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista ElementiArmadio"
        );
        console.error(err);
      });
  }


  async getAttivita() {
    console.log(`get AttivitaArmadio paziente: ${this.paziente._id}`);
    this.armadioService
      .getAttivitaByPaziente(this.paziente._id)
      .then((f: Armadio[]) => {
        this.attArmadio = f;

        this.AttArmadioDataSource = new MatTableDataSource<Armadio>(
          this.attArmadio
        );
        this.AttArmadioDataSource.paginator = this.AttArmadioPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista AttivitaArmadio"
        );
        console.error(err);
      });
  }


  async runControl(period) {  
    if(this.controllo == "")  
      this.controllo = {};
    this.controllo.paziente =this.paziente._id;
    this.controllo.pazienteName =this.paziente.nome;
    this.controllo.anno = (new Date().getFullYear()).toString();

    const dataAttuale = new Date();


    if(period == 'primavera'){
      
      let dataStr = new Date().getFullYear() + '-03-21';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-06-20';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale <= data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }

      this.controllo.primavera = new Date();
    }

    if(period == 'estate'){
      let dataStr = new Date().getFullYear() + '-06-21';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-9-22';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale <= data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }

      this.controllo.estate = new Date();
      //this.controllo.operatorNameEstate =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'autunno'){
      let dataStr = new Date().getFullYear() + '-9-23';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-12-21';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale <= data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }

      this.controllo.autunno = new Date();
      //this.controllo.operatorNameAutunno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'inverno'){
      let dataStr = new Date().getFullYear() + '-12-22';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-03-20';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale <= data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.inverno = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'gennaio'){
      let dataStr = new Date().getFullYear() + '-01-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-02-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.gennaio = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'febbraio'){
      let dataStr = new Date().getFullYear() + '-02-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-03-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.febbraio = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }



    if(period == 'marzo'){
      let dataStr = new Date().getFullYear() + '-03-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-04-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.marzo = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }



    if(period == 'aprile'){
      let dataStr = new Date().getFullYear() + '-04-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-05-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.aprile = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }

    if(period == 'maggio'){
      let dataStr = new Date().getFullYear() + '-05-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-06-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.maggio = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'giugno'){
      let dataStr = new Date().getFullYear() + '-06-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-07-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.giugno = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'luglio'){
      let dataStr = new Date().getFullYear() + '-07-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-08-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.luglio = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }


    if(period == 'agosto'){
      let dataStr = new Date().getFullYear() + '-08-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-09-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.agosto = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }

    if(period == 'settembre'){
      let dataStr = new Date().getFullYear() + '-09-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-10-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.settembre = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }

    if(period == 'ottobre'){
      let dataStr = new Date().getFullYear() + '-10-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-11-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.ottobre = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }

    if(period == 'novembre'){
      let dataStr = new Date().getFullYear() + '-11-01';
      let data = new Date(dataStr);
      let data2Str = new Date().getFullYear() + '-12-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.novembre = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }

    if(period == 'dicembre'){
      let dataStr = new Date().getFullYear() + '-12-01';
      let data = new Date(dataStr);
      let data2Str = (new Date().getFullYear() + 1) + '-01-01';
      let data2 = new Date(data2Str);
      if(dataAttuale >= data  && dataAttuale < data2)
      {
        this.messageService.showMessageError(
          "Tempo scaduto per effettuare questo controllo!"
        );
        return;
      }
      this.controllo.dicembre = new Date();
      //this.controllo.operatorNameInverno =this.dipendente.nome + ' ' + this.dipendente.cognome;
    }





    console.log("Insert runControl: ", this.controllo);
    this.controlliOSSService
      .insert(this.controllo)
      .then((result: ControlliOSS) => {
        console.log("Insert runControl: ", result);
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento controllo");
        console.error(err);
      });
  }

async getControlliPaziente() {
    console.log(`get Controlli paziente: ${this.paziente._id}`);
    this.controlliOSSService
      .getAttivitaByPaziente(this.paziente._id)
      .then((f: ControlliOSS) => {
      
        this.controllo = ControlliOSS.clone(f[0]);
        console.log(`controllo: ${JSON.stringify(this.controllo)}`);
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Controlli"
        );
        console.error(err);
      });
  }
  
}
