import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';
import { MansioniService } from '../../service/mansioni.service';
import { NominaDipendentiService } from '../../service/nominaDipendente.service';
import { MatDialog } from '@angular/material/dialog';
import { AgendaClinica } from '../../models/agendaClinica';
import { AgendaClinicaService } from '../../service/agendaClinica.service';
import { DialogAgendaClinicaComponent } from '../../dialogs/dialog-agendaClinica/dialog-agendaClinica.component';

@Component({
  selector: 'app-agendaClinica',
  templateUrl: './agendaClinica.component.html',
  styleUrls: ['./agendaClinica.component.css']
})


export class AgendaClinicaComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = [
    "evento",
    "tipo",
    "paziente",
    "status",
    "dataReq",
    "dataEvento",
    "note",
    "action",
  ];
  public tipo: String;
  @ViewChild("paginatoragendaClinica", { static: false })
  paginatoragendaClinica: MatPaginator;
  dataSource: AgendaClinica[];
  public agendaClinicaDataSource: MatTableDataSource<AgendaClinica>;
  public inputSearchField: String;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService, public docService: DocumentiService,
    public agendaClinicaService: AgendaClinicaService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public nominaService: NominaDipendentiService,
    public mansioniService: MansioniService) {
    this.dataSource = [];
    this.agendaClinicaDataSource= new MatTableDataSource<AgendaClinica>();
    this.loadUser();
    this.tipo = "agendaClinica";

    this.getEvento();
  }

  ngOnInit() {
    this.dataSource = [];
    this.agendaClinicaDataSource = new MatTableDataSource<AgendaClinica>();
    this.getEvento();
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            
            this.dipendente = x[0];
            this.getEvento();
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.agendaClinicaDataSource.filter = filterValue.trim().toLowerCase();
    }

  cleanSearchField() {
    this.agendaClinicaDataSource.filter = undefined;
    this.inputSearchField = undefined;
  }

  AddEvento() {
    const dialogRef = this.dialog.open(DialogAgendaClinicaComponent, {
      data: {
        dipendente: this.dipendente,
        item: new AgendaClinica,
        add: true
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.agendaClinicaService.getagendaClinica().then((result) => {
        this.dataSource = result.sort((a, b) => {
          const dateA = new Date(a.dataRequest)
          const dateB = new Date(b.dataRequest);
          return dateB.getTime() - dateA.getTime();
        });
        this.agendaClinicaDataSource.data = result.sort((a, b) => {
          const dateA = new Date(a.dataRequest)
          const dateB = new Date(b.dataRequest);
          return dateB.getTime() - dateA.getTime();
        });
        this.agendaClinicaDataSource.paginator = this.paginatoragendaClinica;
      });
    });

  }
  EditEvento(item: AgendaClinica) {
    const dialogRef = this.dialog.open(DialogAgendaClinicaComponent, {
      data: {
        dipendente: this.dipendente,
        item: item,
        add: false
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.agendaClinicaService.getagendaClinica().then((result) => {
        this.dataSource = result.sort((a, b) => {
          const dateA = new Date(a.dataRequest)
          const dateB = new Date(b.dataRequest);
          return dateB.getTime() - dateA.getTime();
        });
        this.agendaClinicaDataSource.data = result.sort((a, b) => {
          const dateA = new Date(a.dataRequest)
          const dateB = new Date(b.dataRequest);
          return dateB.getTime() - dateA.getTime();
        });
        this.agendaClinicaDataSource.paginator = this.paginatoragendaClinica;
        window.location.reload();
      });
    });
  }

  getEvento() {
    this.agendaClinicaService.getagendaClinica().then((result) => {
      this.dataSource = result.sort((a, b) => {
        const dateA = new Date(a.dataRequest)
        const dateB = new Date(b.dataRequest);
        return dateB.getTime() - dateA.getTime();
      });
      this.agendaClinicaDataSource.data = this.dataSource;
      this.agendaClinicaDataSource.paginator = this.paginatoragendaClinica;
    });
  }
}
