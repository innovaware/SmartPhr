import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { UploadService } from 'src/app/service/upload.service';
import { SegnalazioneService } from '../../service/segnalazione.service';
import { Segnalazione } from '../../models/segnalazione';
import { MessagesService } from '../../service/messages.service';
import { MansioniService } from '../../service/mansioni.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSegnalazioneComponent } from '../../dialogs/dialog-segnalazione/dialog-segnalazione.component';

@Component({
  selector: 'app-segnalazioni',
  templateUrl: './segnalazioni.component.html',
  styleUrls: ['./segnalazioni.component.css']
})
export class SegnalazioneComponent implements OnInit {


  public admin: boolean;
  dipendente: Dipendenti;
  public dataSourceSegnalazioni: MatTableDataSource<Segnalazione>;
  public segnalazioni: Segnalazione[];
  DisplayedColumns: string[] = ["numero", "utenteNome", "descrizione", "status", "dataSegnalazione", "datapresaincarico", "datarisoluzione", "action"];
  @ViewChild("paginatorSegnalazioni", { static: false }) paginator: MatPaginator;



  constructor(
    public dialog: MatDialog,
    public segnalazioneService: SegnalazioneService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    public mansioniService: MansioniService) {
    this.admin = false;
    this.loadUser();
    this.segnalazioni = []
    this.dataSourceSegnalazioni = new MatTableDataSource<Segnalazione>([]);
    segnalazioneService.getSegnalazione().subscribe((result) => {
      this.segnalazioni = result.sort((a, b) => {
        const dateA = new Date(a.dataSegnalazione)
        const dateB = new Date(b.dataSegnalazione);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceSegnalazioni.data = result.sort((a, b) => {
        const dateA = new Date(a.dataSegnalazione)
        const dateB = new Date(b.dataSegnalazione);
        return dateB.getTime() - dateA.getTime();
      });;
      this.dataSourceSegnalazioni.paginator = this.paginator;
    });
  }

  ngOnInit() {
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            this.dipendente = x[0];
            this.mansioniService.getById(this.dipendente.mansione).then((result) => {
              if (result.codice == "AU" || result.codice == "DA" || result.codice == "RA") {
                this.admin = true;
              }
            });
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });

    this.segnalazioneService.getSegnalazione().subscribe((result) => {
      this.segnalazioni = result.sort((a, b) => {
        const dateA = new Date(a.dataSegnalazione)
        const dateB = new Date(b.dataSegnalazione);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceSegnalazioni.data = result.sort((a, b) => {
        const dateA = new Date(a.dataSegnalazione)
        const dateB = new Date(b.dataSegnalazione);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceSegnalazioni.paginator = this.paginator;
    });
  }

  AddSegnalazione() {
    var num = this.segnalazioni.length;
    const dialogRef = this.dialog.open(DialogSegnalazioneComponent, {
      data: {
        dipendente: this.dipendente,
        num:num
      },
      width: "512px",
      height: "382px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.segnalazioneService.getSegnalazione().subscribe((result) => {
        this.segnalazioni = result.sort((a, b) => {
          const dateA = new Date(a.dataSegnalazione)
          const dateB = new Date(b.dataSegnalazione);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSourceSegnalazioni.data = result.sort((a, b) => {
          const dateA = new Date(a.dataSegnalazione)
          const dateB = new Date(b.dataSegnalazione);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSourceSegnalazioni.paginator = this.paginator;
      });
    });
    
  }

  presoInCarico(segnalazione: Segnalazione) {
    segnalazione.presoincarico = true;
    segnalazione.status = "Preso in carico";
    segnalazione.datapresaincarico = new Date();
    this.segnalazioneService.Update(segnalazione).subscribe((result) => {
      const index = this.segnalazioni.indexOf(segnalazione);
      this.segnalazioni[index] = segnalazione;
      this.dataSourceSegnalazioni.data = this.segnalazioni;
      this.dataSourceSegnalazioni.paginator = this.paginator;
    });
  }

  risolto(segnalazione: Segnalazione) {
    segnalazione.datarisoluzione = new Date();
    segnalazione.risolto = true;
    segnalazione.status = "Risolto";
    this.segnalazioneService.Update(segnalazione).subscribe((result) => {
      const index = this.segnalazioni.indexOf(segnalazione);
      this.segnalazioni[index] = segnalazione;
      this.dataSourceSegnalazioni.data = this.segnalazioni.sort((a, b) => {
        const dateA = new Date(a.dataSegnalazione)
        const dateB = new Date(b.dataSegnalazione);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceSegnalazioni.paginator = this.paginator;
    });
  }



}
