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
  @Input() data: Permessi[];
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
    "cognome",
    "nome",
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "cf",
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
  ) {}

  ngOnChanges(changes) {
    this.dataSource = new MatTableDataSource<Permessi>(this.data);
    this.dataSource.paginator = this.paginator;
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
      dataInizio: undefined,
      dataFine: undefined,
      user: this.dipendente._id,
      dataRichiesta: dataCurrent,
    };
  }

  async delete(permesso: Permessi) {
    console.log("Cancella permesso: ", permesso);

    /*this.ferieService
          .remove(doc)
          .then((x) => {
            console.log("Privacy cancellata");
            const index = this.docsprivacy.indexOf(doc);
            console.log("Privacy cancellata index: ", index);
            if (index > -1) {
              this.docsprivacy.splice(index, 1);
            }

            console.log("Privacy cancellata : ", this.docsprivacy);
            this.docsprivacyDataSource.data = this.docsprivacy;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione Privacy");
            console.error(err);
          });*/
  }

  async savePermesso(permesso: Permessi) {
    this.uploadingPermesso = true;

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
