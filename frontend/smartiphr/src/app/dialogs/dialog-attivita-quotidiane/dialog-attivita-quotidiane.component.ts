import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Attivita } from 'src/app/models/attivita';
import { AttivitaOSS } from 'src/app/models/attivitaOSS';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Paziente } from 'src/app/models/paziente';
import { User } from 'src/app/models/user';
import { AttivitaService } from 'src/app/service/attivita.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';


@Component({
  selector: 'app-dialog-attivita-quotidiane',
  templateUrl: './dialog-attivita-quotidiane.component.html',
  styleUrls: ['./dialog-attivita-quotidiane.component.css']
})
export class DialogAttivitaQuotidianeComponent implements OnInit {

  @ViewChild("paginatorAttivita",{static: false})
  AttivitaPaginator: MatPaginator;
  public attivitaDataSource: MatTableDataSource<AttivitaOSS>;
  public attivita: AttivitaOSS[];
  dipendente: Dipendenti = {} as Dipendenti;
  utente: User = {} as User;
  paziente: Paziente;
  DisplayedColumns: string[] = ["description", "data", "operator", "turno"];
  
  constructor(public dialogRef: MatDialogRef<DialogAttivitaQuotidianeComponent>,
    public attivitaService: AttivitaService,
    public dialog: MatDialog,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) { 
      this.paziente = Paziente.clone(data.paziente);
    }

  ngOnInit() {
  }


  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user._id)
        .then((x) => {
          console.log("dipendente: " + JSON.stringify(x[0]));
          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }


}
