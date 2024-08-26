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
  selector: 'app-lavanderia-esterna',
  templateUrl: './lavanderia-esterna.component.html',
  styleUrls: ['./lavanderia-esterna.component.css']
})
export class LavanderiaEsternaComponent implements OnInit {

  DisplayedColumns: string[] = ["tipo", "giacenza", "action"];

  DisplayedColumnsAttivita: string[] = ["tipo", "carico", "scarico", "lacerati", "dataultimamodifica", "firma"];




  @ViewChild("paginatorLavanderiaExt", { static: false })
  LavanderiaExtPaginator: MatPaginator;
  public LavanderiaExtDataSource: MatTableDataSource<LettoCamera>;
  public LavanderiaExt: LettoCamera[];


  @ViewChild("paginatorRegistroExt", { static: false })
  LavanderiaAttivitaExtPaginator: MatPaginator;
  public LavanderiaAttivitaExtDataSource: MatTableDataSource<AttivitaRifacimentoLetti>;
  public LavanderiaAttivitaExt: AttivitaRifacimentoLetti[];


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
        this.LavanderiaExt = f.filter(x => x.isInternal === false);
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
        this.LavanderiaAttivitaExt = f.filter(x => x.isInternal === false)
          .sort((a, b) => new Date(b.dataUltimaModifica).getTime() - new Date(a.dataUltimaModifica).getTime());
        this.LavanderiaAttivitaExtDataSource = new MatTableDataSource<AttivitaRifacimentoLetti>(
          this.LavanderiaAttivitaExt
        );
        this.LavanderiaAttivitaExtDataSource.paginator = this.LavanderiaAttivitaExtPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista ReportAttivita"
        );
        console.error(err);
      });
  }

  // LAVANDERIA Ext
  async Details(row: LettoCamera) {
    var dialogRef = this.dialog.open(DialogRifacimentoLettiComponent, {
      data: {
        lettocamera: row,
        isInternal: false,
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
