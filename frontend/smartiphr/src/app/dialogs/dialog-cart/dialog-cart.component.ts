import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CarrelloItem } from '../../models/carrelloItem';
import { Carrello } from '../../models/carrello';
import { title } from 'process';
import { CarrelloService } from '../../service/carrello.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Dipendenti } from '../../models/dipendenti';
import { DipendentiService } from '../../service/dipendenti.service';
import { AuthenticationService } from '../../service/authentication.service';
import { MessagesService } from '../../service/messages.service';
import { RegistroCarrello } from '../../models/registroCarrello';
import { RegistroCarrelloService } from '../../service/registroCarrello.service';
import { DialogQuestionComponent } from '../dialog-question/dialog-question.component';
import { DialogCartItemComponent } from '../dialog-cart-item/dialog-cart-item.component';

@Component({
  selector: 'app-dialog-cart',
  templateUrl: './dialog-cart.component.html',
  styleUrls: ['./dialog-cart.component.css']
})
export class DialogCartComponent implements OnInit, AfterViewInit {

  title: String;
  items: CarrelloItem[];
  uso: Boolean;
  displayedColumns: string[] = ["nome", "tipo", "quantita", "paziente", "note", "action"];
  dataSource: MatTableDataSource<CarrelloItem>;
  dipendente: Dipendenti;
  @ViewChild("Contenuto", { static: false }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    private CartServ: CarrelloService,
    private dipendenteService: DipendentiService,
    private authenticationService: AuthenticationService,
    private messageService: MessagesService,
    private regServ: RegistroCarrelloService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      carrello: Carrello,
    }) {
    this.dataSource = new MatTableDataSource<CarrelloItem>();
    this.title = data.carrello.nomeCarrello;
    this.items = data.carrello.contenuto;
    console.log(data.carrello.contenuto);
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
    this.uso = data.carrello.inUso;
    this.loadUser();
  }

  ngAfterViewInit() {
    this.CartServ.getById(this.data.carrello._id).then((res: Carrello) => {
      console.log(res);
      this.data.carrello = res;
      this.dataSource.data = this.data.carrello.contenuto;
      this.dataSource.paginator = this.paginator;
    });
  }
  ngOnInit(): void {

    this.dataSource = new MatTableDataSource<CarrelloItem>();
    this.title = this.data.carrello.nomeCarrello;
    this.items = this.data.carrello.contenuto;
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
    this.loadUser();
  }

  add() {
    const dialogRef = this.dialog.open(DialogCartItemComponent, {
      data: {
        carrello: this.data.carrello,
        edit: false,
        type: this.data.carrello.type,
        dipendente: this.dipendente
      },
      width: "800px",
      height: "400px"
    });
    dialogRef.afterClosed().subscribe(() => {
      this.CartServ.getById(this.data.carrello._id).then((res: Carrello) => {
        console.log(res);
        this.data.carrello = res;
        this.dataSource.data = this.data.carrello.contenuto;
        this.dataSource.paginator = this.paginator;
      });
    });

  }

  edit(row: CarrelloItem) {

    const dialogRef = this.dialog.open(DialogCartItemComponent, {
      data: {
        carrello: this.data.carrello,
        edit: true,
        elemento: row,
        type: this.data.carrello.type,
        dipendente: this.dipendente
      },
      width: "800px",
      height: "400px"
    });
    dialogRef.afterClosed().subscribe(() => {
      this.CartServ.getById(this.data.carrello._id).then((res: Carrello) => {
        console.log(res);
        this.data.carrello = res;
        this.dataSource.data = this.data.carrello.contenuto;
        this.dataSource.paginator = this.paginator;
      });
    });
  }


  async save() {
    let cart: Carrello = await this.CartServ.getById(this.data.carrello._id);
    cart.inUso = this.uso;
    cart.contenuto = this.items;
    cart.operatoreID = this.dipendente._id;
    cart.operatoreName = this.dipendente.nome + " " + this.dipendente.cognome;
    console.log("Carrello: ", cart);

    // Aggiorna il carrello
    await this.CartServ.update(cart).toPromise();

    let frase = "";

    if (this.uso) {
      frase = "Carrello Occupato";
    }
    else {
      if (cart.type.toLowerCase() == "oss") {
        frase = "Carrello ordinato e liberato";
      }
      else {
        frase = "Carrello liberato";
      }
    }

    // Crea e popola l'oggetto RegistroCarrello
    let reg: RegistroCarrello = {
      carrelloID: cart._id,
      carrelloName: cart.nomeCarrello,
      dataModifica: new Date(),
      type: cart.type,
      operator: cart.operatoreID,
      operatorName: cart.operatoreName,
      operation: frase
    };

    console.log("Registro: ", reg);

    // Aggiunge il registro al servizio
    await this.regServ.add(reg);
  }

  async toggleUso() {
    if (this.data.carrello.type.toLowerCase() == "oss" && this.uso) {
      const dialogData = {
        data: { message: "Hai ordinato il carrello?" }
      };

      const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

      if (!result) {
        return;
      }
    }
    this.uso = !this.uso;
  }

  loadUser() {
    this.dipendente = new Dipendenti();
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

}
