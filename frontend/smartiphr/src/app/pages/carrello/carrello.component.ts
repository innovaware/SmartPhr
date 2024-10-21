import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { UploadService } from 'src/app/service/upload.service';
import { MessagesService } from '../../service/messages.service';
import { MatDialog } from '@angular/material/dialog';
import { Carrello } from '../../models/carrello';
import { CarrelloService } from '../../service/carrello.service';
import { AttivitafarmacipresidiService } from '../../service/attivitafarmacipresidi.service';
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
  displayedColumnsReg: string[] = ["Carrello", "Elemento", "Operazione", "Quantita","Res", "DataModifica", "Operatore"];
  @ViewChild("NonInUso", { static: false }) paginatorNonUso: MatPaginator;
  @ViewChild("Registro", { static: false }) paginatorReg: MatPaginator;

  dipendente: Dipendenti;
  carrello: Carrello[];
  registro: RegistroCarrello[];
  dataSource: MatTableDataSource<Carrello>;
  dataSourceReg: MatTableDataSource<RegistroCarrello>;
  title: String;
  constructor(
    public dialog: MatDialog,
    public uploadService: UploadService,
    public cartServ: CarrelloService,
    public RegistroServ: RegistroCarrelloService,
    private route: ActivatedRoute,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    public AttivitaFarmServ: AttivitafarmacipresidiService) {
    this.carrello = [];
    this.registro = [];
    this.dataSource = new MatTableDataSource<Carrello>();
    this.dataSourceReg = new MatTableDataSource<RegistroCarrello>();
    this.route.queryParams.subscribe(params => {
      const func = params.function as string;
      switch (func?.toLowerCase()) {
        case 'infermieri':
          this.getCarrelli("Infermieri");
          this.getRegistro("Infermieri");
          this.title = "Infermieri";
          break;
        case 'oss':
          this.getCarrelli("OSS");
          this.getRegistro("OSS");
          this.title = "OSS";
          break;
      }
    });
    this.loadUser();
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
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }

  getCarrelli(type: String) {
    this.carrello = [];
    this.dataSource = new MatTableDataSource<Carrello>();
    this.cartServ.getByType(type).then((result: Carrello[]) => {
      this.carrello = result;
      this.dataSource.data = this.carrello;
      this.dataSource.paginator = this.paginatorNonUso;
    });
  }

  getRegistro(type: String) {
    this.registro = [];
    this.dataSourceReg = new MatTableDataSource<RegistroCarrello>();
    this.RegistroServ.getByType(type).then((result: RegistroCarrello[]) => {
      this.carrello = result.sort((a, b) => new Date(b.dataModifica).getTime() - new Date(a.dataModifica).getTime());;
      this.dataSourceReg.data = this.carrello;
      this.dataSourceReg.paginator = this.paginatorReg;
    });
  }

  openDialog(row: Carrello) {
    const type = row.type;
    if (!type) {
      console.error("Il tipo non è definito:", type);
      return;
    }
    console.log(type);
    const dialogRef = this.dialog.open(DialogCartComponent, {
      data: { carrello: row },
      width: "800px",
      height: "550px"
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getCarrelli(type);
      this.getRegistro(type);
    });
  }


}
