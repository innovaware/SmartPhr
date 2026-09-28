import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CarrelloItem } from '../../models/carrelloItem';
import { Carrello } from '../../models/carrello';
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
export class DialogCartComponent implements OnInit {

  title: string;
  uso: boolean;
  displayedColumns: string[] = ["nome", "tipo", "quantita", "paziente", "note", "actions"];
  dataSource = new MatTableDataSource<CarrelloItem>();
  dipendente!: Dipendenti;

  @ViewChild("Contenuto", { static: true }) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogCartComponent>,
    private cartServ: CarrelloService,
    private dipendenteService: DipendentiService,
    private authenticationService: AuthenticationService,
    private messageService: MessagesService,
    private regServ: RegistroCarrelloService,
    @Inject(MAT_DIALOG_DATA) public data: { carrello: Carrello }
  ) {
    this.title = data.carrello.nomeCarrello.valueOf();
    this.uso = data.carrello.inUso.valueOf();
  }

  ngOnInit(): void {
    this.refreshCartData();
    this.loadUser();
  }

  refreshCartData(): void {
    this.cartServ.getById(this.data.carrello._id).then((res: Carrello) => {
      this.data.carrello = res;
      this.dataSource.data = res.contenuto || [];
      this.dataSource.paginator = this.paginator;
    });
  }

  add(): void {
    const dialogRef = this.dialog.open(DialogCartItemComponent, {
      data: {
        carrello: this.data.carrello,
        edit: false,
        type: this.data.carrello.type,
        dipendente: this.dipendente
      },
      width: "700px"
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.refreshCartData();
    });
  }

  edit(row: CarrelloItem): void {
    const dialogRef = this.dialog.open(DialogCartItemComponent, {
      data: {
        carrello: this.data.carrello,
        edit: true,
        elemento: row,
        type: this.data.carrello.type,
        dipendente: this.dipendente
      },
      width: "700px"
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.refreshCartData();
    });
  }

  async save(): Promise<void> {
    try {
      let cart: Carrello = await this.cartServ.getById(this.data.carrello._id);
      const statoPrecedente = cart.inUso;
      cart.inUso = this.uso;

      if (this.dipendente) {
        cart.operatoreID = this.dipendente._id;
        cart.operatoreName = `${this.dipendente.nome} ${this.dipendente.cognome}`;
      }

      await this.cartServ.update(cart).toPromise();

      if (statoPrecedente !== this.uso) {
        let frase = this.uso
          ? "Carrello Occupato"
          : (cart.type.toLowerCase() === "oss" ? "Carrello ordinato e liberato" : "Carrello liberato");

        let reg: RegistroCarrello = {
          carrelloID: cart._id,
          carrelloName: cart.nomeCarrello,
          dataModifica: new Date(),
          type: cart.type,
          operator: cart.operatoreID,
          operatorName: cart.operatoreName,
          operation: frase
        };

        await this.regServ.add(reg);
      }

      this.messageService.showMessage("Salvataggio effettuato con successo");
      this.dialogRef.close(true);
    } catch (err) {
      this.messageService.showMessageError("Errore durante il salvataggio");
    }
  }

  async modificaQuantita(row: CarrelloItem, operazione: string): Promise<void> {
    let cart: Carrello = await this.cartServ.getById(this.data.carrello._id);
    const index = cart.contenuto.findIndex(item => item._id === row._id);

    if (index === -1) return;

    cart.contenuto[index].quantita = Number(cart.contenuto[index].quantita) - 1;

    // Conversione sicura per evitare errori di tipo Number/number
    const qtaCalcolata = Number(cart.contenuto[index].quantita);

    let reg: RegistroCarrello = {
      carrelloID: cart._id,
      carrelloName: cart.nomeCarrello,
      elemento: row.elementoName,
      dataModifica: new Date(),
      quantita: 1,
      quantitaRes: qtaCalcolata >= 0 ? qtaCalcolata : 0,
      type: cart.type,
      operator: this.dipendente ? this.dipendente._id : '',
      operatorName: this.dipendente ? `${this.dipendente.nome} ${this.dipendente.cognome}` : '',
      operation: operazione
    };
    await this.regServ.add(reg);

    if (Number(cart.contenuto[index].quantita) <= 0) {
      cart.contenuto.splice(index, 1);
    }

    await this.cartServ.update(cart).toPromise();
    this.refreshCartData();
  }

  async scarto(row: CarrelloItem): Promise<void> {
    await this.modificaQuantita(row, "Elemento compromesso");
    this.messageService.showMessage("Elemento scartato");
  }

  async somministra(row: CarrelloItem): Promise<void> {
    await this.modificaQuantita(row, "Elemento somministrato");
    this.messageService.showMessage("Elemento somministrato");
  }

  async toggleUso(): Promise<void> {
    if (this.data.carrello.type.toLowerCase() === "oss" && this.uso) {
      const dialogRef = this.dialog.open(DialogQuestionComponent, {
        data: { message: "Hai ordinato il carrello prima di liberarlo?" }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;
    }
    this.uso = !this.uso;
  }

  loadUser(): void {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      if (user && user.dipendenteID) {
        this.dipendenteService.getByIdUser(user.dipendenteID)
          .then((x) => this.dipendente = x[0]);
      }
    });
  }
}
