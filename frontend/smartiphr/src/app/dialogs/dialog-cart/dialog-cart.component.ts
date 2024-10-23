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
  displayedColumns: string[] = ["nome", "tipo", "quantita", "paziente", "note","somministra","scarta", "action"];
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

    // Subscribe to dialog close event
    dialogRef.afterClosed().subscribe(async () => {
      try {
        await this.delay(1000); // Aggiungi il delay qui
        const updatedCarrello = await this.CartServ.getById(this.data.carrello._id);
        console.log(updatedCarrello);

        this.data.carrello = updatedCarrello;
        this.dataSource.data = updatedCarrello.contenuto;
        this.dataSource.paginator = this.paginator;
      } catch (error) {
        console.error('Failed to update cart:', error);
        // Optionally show an error notification to the user
      }
    });
  }



  async save() {
    let cart: Carrello = await this.CartServ.getById(this.data.carrello._id);
    cart.inUso = this.uso;
    cart.operatoreID = this.dipendente._id;
    cart.operatoreName = this.dipendente.nome + " " + this.dipendente.cognome;
    console.log("Carrello: ", cart);

    // Aggiorna il carrello
    await this.CartServ.update(cart).toPromise();

    if (cart.inUso != this.uso) {
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

    this.messageService.showMessage("Salvataggio effettuato");
  }

  async modificaQuantita(row: CarrelloItem, operazione: string) {
    let cart: Carrello = await this.CartServ.getById(this.data.carrello._id);
    const index = cart.contenuto.findIndex(item => item._id === row._id);
    if (index === -1) {
      console.error("Elemento non trovato nel carrello");
      return; // Uscita dalla funzione se l'elemento non è trovato
    }
    // Riduzione della quantità
    cart.contenuto[index].quantita = Number(cart.contenuto[index].quantita) - 1;

    // Registro della modifica
    let reg: RegistroCarrello = {
      carrelloID: cart._id,
      carrelloName: cart.nomeCarrello,
      elemento: row.elementoName,
      dataModifica: new Date(),
      quantita: 1,
      quantitaRes: cart.contenuto[index].quantita.valueOf() >= 0 ? cart.contenuto[index].quantita : 0,
      type: cart.type,
      operator: this.dipendente._id,
      operatorName: this.dipendente.nome + " " + this.dipendente.cognome,
      operation: operazione
    };
    console.log("Registro: ", reg);
    await this.regServ.add(reg);

    // Rimozione dell'elemento se la quantità è zero o inferiore
    if (cart.contenuto[index].quantita.valueOf() <= 0) {
      if (index > -1) {
        cart.contenuto.splice(index, 1);
        let reg1: RegistroCarrello = {
          carrelloID: cart._id,
          carrelloName: cart.nomeCarrello,
          elemento: row.elementoName,
          dataModifica: new Date(),
          type: cart.type,
          operator: this.dipendente._id,
          operatorName: this.dipendente.nome + " " + this.dipendente.cognome,
          operation: "Elemento rimosso"
        };
        console.log("Registro: ", reg1);
        await this.regServ.add(reg1);
      }
    }

    this.dataSource.data = cart.contenuto;
    this.dataSource.paginator = this.paginator;
    await this.CartServ.update(cart).toPromise();
  }

  async scarto(row: CarrelloItem) {
    await this.modificaQuantita(row, "Elemento compromesso");
    this.messageService.showMessage("Elemento scartato");
  }

  async somministra(row: CarrelloItem) {
    await this.modificaQuantita(row, "Elemento somministrato");
    this.messageService.showMessage("Elemento somministrato");
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

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
