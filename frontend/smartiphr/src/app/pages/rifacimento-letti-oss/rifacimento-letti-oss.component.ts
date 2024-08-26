import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AttivitaRifacimentoLetti } from 'src/app/models/attivitaRifacimentoLetti';
import { Dipendenti } from 'src/app/models/dipendenti';
import { LettoCamera } from 'src/app/models/lettoCamera';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { GestLettoCameraService } from 'src/app/service/gest-letto-camera.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-rifacimento-letti-oss',
  templateUrl: './rifacimento-letti-oss.component.html',
  styleUrls: ['./rifacimento-letti-oss.component.css']
})
export class RifacimentoLettiOssComponent implements OnInit {

  DisplayedColumnsExt: string[] = ["camera", "lenzuola", "lenzuola_lacerati", "traverse", "traverse_lacerati", "action"];
  DisplayedColumnsAttivitaExt: string[] = ["camera", "carico_lenzuola", "carico_lenzuola_lacerati", "carico_traverse", "carico_traverse_lacerati", "operator", "date"];

  DisplayedColumnsInt: string[] = ["camera", "cuscini", "cuscini_lacerati", "coprimaterassi", "coprimaterassi_lacerati",
                                  "copriletti", "copriletti_lacerati", "coperte", "coperte_lacerati","federe", "federe_lacerati"
                                  ,"action"];

  DisplayedColumnsAttivitaInt: string[] = ["camera", "carico_cuscini", "carico_cuscini_lacerati", "carico_coprimaterassi", "carico_coprimaterassi_lacerati",
                                  "carico_copriletti", "carico_copriletti_lacerati", "carico_coperte", "carico_coperte_lacerati","carico_federe", "carico_federe_lacerati",
                                  "operator", "date"];

  @ViewChild("paginatorLavanderiaExt",{static: false})
  LavanderiaExtPaginator: MatPaginator;
  public LavanderiaExtDataSource: MatTableDataSource<LettoCamera>;
  public LavanderiaExt: LettoCamera[];

  @ViewChild("paginatorLavanderiaAttivitaExt",{static: false})
  LavanderiaAttivitaExtPaginator: MatPaginator;
  public LavanderiaAttivitaExtDataSource: MatTableDataSource<AttivitaRifacimentoLetti>;
  public LavanderiaAttivitaExt: AttivitaRifacimentoLetti[];


  @ViewChild("paginatorLavanderiaInt",{static: false})
  LavanderiaIntPaginator: MatPaginator;
  public LavanderiaIntDataSource: MatTableDataSource<LettoCamera>;
  public LavanderiaInt: LettoCamera[];


  @ViewChild("paginatorLavanderiaAttivitaInt",{static: false})
  LavanderiaAttivitaIntPaginator: MatPaginator;
  public LavanderiaAttivitaIntDataSource: MatTableDataSource<AttivitaRifacimentoLetti>;
  public LavanderiaAttivitaInt: AttivitaRifacimentoLetti[];


  dipendente: Dipendenti = {} as Dipendenti;
  
  constructor( 
    public gestLettoCameraService: GestLettoCameraService,
    public messageService: MessagesService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
    this.loadUser();
    this.getReportLetti();
    this.getReportAttivita();
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user.dipendenteID)
        .then((x) => {
          
          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }
  

  async getReportLetti() {
    console.log(`get ReportLetti`);
    this.gestLettoCameraService
      .get()
      .then((f: LettoCamera[]) => {
        this.LavanderiaExt = f;
        this.LavanderiaInt = f;
        this.LavanderiaIntDataSource = new MatTableDataSource<LettoCamera>(
          this.LavanderiaInt
        );
        this.LavanderiaIntDataSource.paginator = this.LavanderiaIntPaginator;

        this.LavanderiaExtDataSource = new MatTableDataSource<LettoCamera>(
          this.LavanderiaExt
        );
        this.LavanderiaExtDataSource.paginator = this.LavanderiaExtPaginator;



      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista ReportLetti"
        );
        console.error(err);
      });
  }


  async getReportAttivita() {
    console.log(`get ReportAttivita`);
    this.gestLettoCameraService
      .getAttivita()
      .then((f: AttivitaRifacimentoLetti[]) => {
        this.LavanderiaAttivitaExt = f;
        this.LavanderiaAttivitaInt = f;
        this.LavanderiaAttivitaExtDataSource = new MatTableDataSource<AttivitaRifacimentoLetti>(
          this.LavanderiaAttivitaExt
        );
        this.LavanderiaAttivitaExtDataSource.paginator = this.LavanderiaAttivitaExtPaginator;

        this.LavanderiaAttivitaIntDataSource = new MatTableDataSource<AttivitaRifacimentoLetti>(
          this.LavanderiaAttivitaInt
        );
        this.LavanderiaAttivitaIntDataSource.paginator = this.LavanderiaAttivitaIntPaginator;



      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista ReportAttivita"
        );
        console.error(err);
      });
  }



  // LAVANDERIA EXT
  async saveExt(row: LettoCamera) {
    row.isInternal = false;
    row.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;
    row.operator = this.dipendente._id;


    console.log("saveExt: ", row);
    this.gestLettoCameraService
      .update(row)
      .then((result: LettoCamera) => {

        const index = this.LavanderiaExt.indexOf(row);
        this.LavanderiaExt[index] = row;
        this.LavanderiaExtDataSource.data = this.LavanderiaExt;
        this.LavanderiaExtDataSource.paginator = this.LavanderiaExtPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento attivita + update record");
        console.error(err);
      });
  }


  // LAVANDERIA INT
  async saveInt(row: LettoCamera) {
    row.isInternal = true;
    row.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;
    row.operator = this.dipendente._id;

    console.log("saveExt: ", row);
    this.gestLettoCameraService
      .update(row)
      .then((result: LettoCamera) => {
        const index = this.LavanderiaInt.indexOf(row);
        this.LavanderiaInt[index] = row;
        this.LavanderiaIntDataSource.data = this.LavanderiaInt;
        this.LavanderiaIntDataSource.paginator = this.LavanderiaIntPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento attivita + update record");
        console.error(err);
      });
  }

}
