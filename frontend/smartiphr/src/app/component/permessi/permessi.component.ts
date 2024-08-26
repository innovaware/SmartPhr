import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { Permessi } from "src/app/models/permessi";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { PermessiService } from "src/app/service/permessi.service";

@Component({
  selector: "app-permessi",
  templateUrl: "./permessi.component.html",
  styleUrls: ["./permessi.component.css"],
})
export class PermessiComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;
  @Input() dipendente: Dipendenti;

  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    permessi: Permessi;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "cf",
    "accettata",
    "action",
  ];

  displayedColumnsExternal: string[] = [
    "dataPermesso",
    "oraInizio",
    "oraFine",
    "dataRichiesta",
    "action",
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public nuovoPermesso: Permessi;
  dataSource: MatTableDataSource<Permessi>;
  public permessi: Permessi[];
  public uploadingPermesso: boolean;
  public addingPermesso: boolean;

  constructor(
    public messageService: MessagesService,
    public permessiService: PermessiService,
    public dipendenteService: DipendentiService
  ) {
    this.permessi = [];
    this.nuovoPermesso = new Permessi();
  }

  ngOnChanges(changes) {
    if (this.data && this.data._id) {
      this.permessiService.getPermessiByDipendenteID(this.data._id).then((result) => {
        this.dataSource = new MatTableDataSource<Permessi>(result);
        this.dataSource.paginator = this.paginator;
        this.permessi = result;
      });
    }
    else {
      this.permessiService.getPermessiByDipendenteID(this.data._id).then((result) => {
        this.permessi = result;
      });
      this.dataSource = new MatTableDataSource<Permessi>(this.permessi);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(permessi: Permessi, item: string) {
    this.showItemEmiter.emit({ permessi: permessi, button: item });
  }

  async updatePermesso(permesso: Permessi) {
    this.permessiService
      .updatePermesso(permesso)
      .then((result: Permessi) => {
        const index = this.permessi.indexOf(permesso);
        permesso.closed = true;
        this.permessi[index] = permesso;

        this.dataSource.data = this.permessi;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore modifica stato Permessi");
        console.error(err);
      });
  }

  sendResp(row) {
    let fId = row._id;
    let status = row.accettata;
    let message = "Sei sicuro di voler respingere questa richiesta?";
    if (status) message = "Sei sicuro di voler accettare questa richiesta?";

    let result = window.confirm(message);
    if (result) {
      this.updatePermesso(row);
    }
  }

  // PERMESSI EXTERNAL
  async addPermesso() {
    let dataCurrent = new Date();

    this.addingPermesso = true;
    this.nuovoPermesso = {
      dataPermesso: undefined,
      oraInizio: undefined,
      oraFine: undefined,
      user: undefined,
      dataRichiesta: dataCurrent,
    };
  }

  async delete(permesso: Permessi) {
    console.log("Cancella permesso: ", permesso);

    this.permessiService
      .remove(permesso)
      .then((x) => {
        console.log("richisesta cancellata");
        const index = this.permessi.indexOf(permesso);
        console.log("richiesta ferie cancellata index: ", index);
        if (index > -1) {
          this.permessi.splice(index, 1);
        }

        console.log("Richiesta cancellata : ", this.permessi);
        this.dataSource.data = this.permessi;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione della richiesta");
        console.error(err);
      });
  }
  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  async savePermesso(permesso: Permessi) {
    permesso.user = this.data._id;
    var campi = "";
    if (permesso.dataPermesso == undefined || permesso.dataPermesso == new Date() || permesso.dataPermesso == null) {
      campi = campi + " Data permesso, ";
    }
    if (permesso.oraInizio == undefined || permesso.oraInizio == "" || permesso.oraInizio == null) {
      campi = campi + " Ora inizio, ";
    }
    if (permesso.oraFine == undefined || permesso.oraFine == "" || permesso.oraFine == null) {
      campi = campi + " Ora fine, ";
    }
    if (campi != "") {
      this.addingPermesso = false;
      this.nuovoPermesso = new Permessi();
      this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
      return;
    }

    if (this.dateDiffInDays(new Date(), new Date(permesso.dataPermesso)) < 3) {
      this.addingPermesso = false;
      this.nuovoPermesso = new Permessi();
      this.messageService.showMessageError("Il permesso va richiesto entro 3 giorni lavorativi di anticipo al giorno della richiesta");
      return;
    }

    if (permesso.oraFine < permesso.oraInizio) {
      this.addingPermesso = false;
      this.nuovoPermesso = new Permessi();
      this.messageService.showMessageError("Non puoi impostare la fine del permesso prima dell'inizio!!!");
      return;
    }
    this.uploadingPermesso = true;
    permesso.dataRichiesta = new Date();
    console.log("Invio Richiesta permesso: ", permesso);
    this.permessiService
      .insertPermesso(permesso)
      .then((result: Permessi) => {
        console.log("Insert permesso: ", result);
        this.permessi.push(result);
        this.dataSource.data = this.permessi;
        this.addingPermesso = false;
        this.uploadingPermesso = false;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento permesso");
        console.error(err);
      });
  }
}
