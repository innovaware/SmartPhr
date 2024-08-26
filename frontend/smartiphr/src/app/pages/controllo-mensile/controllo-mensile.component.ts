import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { UploadService } from 'src/app/service/upload.service';
import { MessagesService } from '../../service/messages.service';
import { MansioniService } from '../../service/mansioni.service';
import { MatDialog } from '@angular/material/dialog';
import { controllomensile } from '../../models/controllomensile';
import { ControlloMensileService } from '../../service/controllomensile.service';
import { DialogControlloMensileComponent } from '../../dialogs/dialog-controllo-mensile/dialog-controllo-mensile.component';

@Component({
  selector: 'app-controllo-mensile',
  templateUrl: './controllo-mensile.component.html',
  styleUrls: ['./controllo-mensile.component.css']
})
export class ControlloMensileComponent implements OnInit {


  public admin: boolean;
  dipendente: Dipendenti;
  public dataSourceControlloMensile: MatTableDataSource<controllomensile>;
  public ControlloMensile: controllomensile[];
  DisplayedColumns: string[] = ["dataControllo", "utenteNome", "esitoPositivo", "tipo", "note",];
  @ViewChild("paginatorControllo", { static: false }) paginator: MatPaginator;



  constructor(
    public dialog: MatDialog,
    public ControlloMensileService: ControlloMensileService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    public mansioniService: MansioniService) {
    this.admin = false;
    this.loadUser();
    this.ControlloMensile = []
    this.dataSourceControlloMensile = new MatTableDataSource<controllomensile>([]);
    ControlloMensileService.get().subscribe((result) => {
      this.ControlloMensile = result.sort((a, b) => {
        const dateA = new Date(a.dataControllo)
        const dateB = new Date(b.dataControllo);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceControlloMensile.data = result.sort((a, b) => {
        const dateA = new Date(a.dataControllo)
        const dateB = new Date(b.dataControllo);
        return dateB.getTime() - dateA.getTime();
      });;
      this.dataSourceControlloMensile.paginator = this.paginator;
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
              if (result.codice == "AU" || result.codice == "DA" || result.codice == "RA" || result.codice =="RGQ") {
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

    this.ControlloMensileService.get().subscribe((result) => {
      this.ControlloMensile = result.sort((a, b) => {
        const dateA = new Date(a.dataControllo)
        const dateB = new Date(b.dataControllo);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceControlloMensile.data = result.sort((a, b) => {
        const dateA = new Date(a.dataControllo)
        const dateB = new Date(b.dataControllo);
        return dateB.getTime() - dateA.getTime();
      });
      this.dataSourceControlloMensile.paginator = this.paginator;
    });
  }

  AddEsito() {
    const dialogRef = this.dialog.open(DialogControlloMensileComponent, {
      data: {
        dipendente: this.dipendente
      },
      width: "800px",
      height: "400px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ControlloMensileService.get().subscribe((result) => {
        this.ControlloMensile = result.sort((a, b) => {
          const dateA = new Date(a.dataControllo)
          const dateB = new Date(b.dataControllo);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSourceControlloMensile.data = result.sort((a, b) => {
          const dateA = new Date(a.dataControllo)
          const dateB = new Date(b.dataControllo);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSourceControlloMensile.paginator = this.paginator;
      });
    });
    
  }


  public inputSearchField;
  cleanSearchField() {
    this.dataSourceControlloMensile.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceControlloMensile.filter = filterValue.trim().toLowerCase();
  }





}
