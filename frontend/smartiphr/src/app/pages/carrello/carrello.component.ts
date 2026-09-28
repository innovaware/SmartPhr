import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { MessagesService } from '../../service/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { Carrello } from '../../models/carrello';
import { CarrelloService } from '../../service/carrello.service';
import { ActivatedRoute } from '@angular/router';
import { RegistroCarrello } from '../../models/registroCarrello';
import { RegistroCarrelloService } from '../../service/registroCarrello.service';
import { DialogCartComponent } from '../../dialogs/dialog-cart/dialog-cart.component';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.css']
})
export class CarrelloComponent implements OnInit {

  displayedColumns: string[] = ["nome", "totElementi", "Status", "Ultimo", "action"];
  displayedColumnsReg: string[] = ["Carrello", "Elemento", "Operazione", "Quantita", "Res", "DataModifica", "Operatore"];

  @ViewChild("paginatorNonUso", { static: false }) paginatorNonUso!: MatPaginator;
  @ViewChild("paginatorReg", { static: false }) paginatorReg!: MatPaginator;

  dipendente!: Dipendenti;
  carrello: Carrello[] = [];
  registro: RegistroCarrello[] = [];
  dataSource = new MatTableDataSource<Carrello>();
  dataSourceReg = new MatTableDataSource<RegistroCarrello>();
  title: string = '';
  currentType: string = '';

  constructor(
    public dialog: MatDialog,
    public cartServ: CarrelloService,
    public registroServ: RegistroCarrelloService,
    private route: ActivatedRoute,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const func = params.function as string;
      if (func) {
        this.currentType = func.toLowerCase() === 'infermieri' ? 'Infermieri' : 'OSS';
        this.title = this.currentType;
        this.loadData();
      }
    });
    this.loadUser();
  }

  loadData(): void {
    if (!this.currentType) return;
    this.getCarrelli(this.currentType);
    this.getRegistro(this.currentType);
  }

  loadUser(): void {
    this.authenticationService.getCurrentUserAsync().subscribe({
      next: (user) => {
        if (user && user.dipendenteID) {
          this.dipendenteService.getByIdUser(user.dipendenteID)
            .then((x) => this.dipendente = x[0])
            .catch((err) => this.messageService.showMessageError("Errore caricamento dipendente (" + err["status"] + ")"));
        }
      }
    });
  }

  getCarrelli(type: string): void {
    this.cartServ.getByType(type).then((result: Carrello[]) => {
      this.carrello = result || [];
      this.dataSource.data = this.carrello;
      this.dataSource.paginator = this.paginatorNonUso;
    });
  }

  getRegistro(type: string): void {
    this.registroServ.getByType(type).then((result: RegistroCarrello[]) => {
      // Corretto il bug che sovrascriveva this.carrello con i dati del registro
      this.registro = (result || []).sort((a, b) => new Date(b.dataModifica).getTime() - new Date(a.dataModifica).getTime());
      this.dataSourceReg.data = this.registro;
      this.dataSourceReg.paginator = this.paginatorReg;
    });
  }

  openDialog(row: Carrello): void {
    if (!row || !row.type) return;

    const dialogRef = this.dialog.open(DialogCartComponent, {
      data: { carrello: row },
      width: "900px",
      maxWidth: "95vw",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((refreshed) => {
      if (refreshed) {
        this.loadData();
      }
    });
  }
}
