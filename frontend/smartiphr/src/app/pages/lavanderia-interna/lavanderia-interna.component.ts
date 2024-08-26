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
import { DialogRifacimentoLettiComponent } from '../../dialogs/dialog-rifacimento-letti/dialog-rifacimento-letti.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lavanderia-interna',
  templateUrl: './lavanderia-interna.component.html',
  styleUrls: ['./lavanderia-interna.component.css']
})
export class LavanderiaInternaComponent implements OnInit {

  DisplayedColumnsInt: string[] = ["tipo", "giacenza", "action"];

  DisplayedColumnsAttivitaInt: string[] = ["tipo", "carico", "scarico", "lacerati", "dataultimamodifica", "firma"];




  @ViewChild("paginatorLavanderiaInt", { static: false })
  LavanderiaIntPaginator: MatPaginator;
  public LavanderiaIntDataSource: MatTableDataSource<LettoCamera>;
  public LavanderiaInt: LettoCamera[];


  @ViewChild("paginatorRegistroInt", { static: false })
  LavanderiaAttivitaIntPaginator: MatPaginator;
  public LavanderiaAttivitaIntDataSource: MatTableDataSource<AttivitaRifacimentoLetti>;
  public LavanderiaAttivitaInt: AttivitaRifacimentoLetti[];


  dipendente: Dipendenti = {} as Dipendenti;

  constructor(
    public gestLettoCameraService: GestLettoCameraService,
    public messageService: MessagesService,
    public dialog: MatDialog,
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
        this.LavanderiaInt = f.filter(x => x.isInternal === true);
        this.LavanderiaIntDataSource = new MatTableDataSource<LettoCamera>(
          this.LavanderiaInt
        );
        this.LavanderiaIntDataSource.paginator = this.LavanderiaIntPaginator;
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
        this.LavanderiaAttivitaInt = f.filter(x => x.isInternal === true)
          .sort((a, b) => new Date(b.dataUltimaModifica).getTime() - new Date(a.dataUltimaModifica).getTime());
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

  // LAVANDERIA INT
  async Details(row: LettoCamera) {
    var dialogRef = this.dialog.open(DialogRifacimentoLettiComponent, {
      data: {
        lettocamera: row,
        isInternal: true,
        dipendente: this.dipendente
      },
      width: "600px",
      height: "450px"
    }).afterClosed()
      .subscribe((result) => {
        this.getReportLetti();
        this.getReportAttivita();
      });

  }

}
