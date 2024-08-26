import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { Ferie } from "src/app/models/ferie";
import { FerieService } from "src/app/service/ferie.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-ferie",
  templateUrl: "./ferie.component.html",
  styleUrls: ["./ferie.component.css"],
})
export class FerieComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;
  @Input() dipendente: Dipendenti;

  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    ferie: Ferie;
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
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "action",
  ];

  public nuovoRichiestaFerie: Ferie;
  public richieste: Ferie[];
  public uploadingRichiestaFerie: boolean;
  public addingRichiestaFerie: boolean;

  @ViewChild("paginatorFerie", { static: false })
  FeriePaginator: MatPaginator;
  dataSource: MatTableDataSource<Ferie>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public messageService: MessagesService,
    public ferieService: FerieService
  ) //public dipendenteService: DipendentiService
  {
    this.richieste = [];
  }

  ngOnChanges(changes) {
    if (this.data && this.data._id) {
      this.ferieService.getFerieByDipendenteID(this.data._id).then((result) => {
        this.dataSource = new MatTableDataSource<Ferie>(result);
        this.dataSource.paginator = this.paginator;
        this.richieste = result;
      });
    }
    else {
      this.ferieService.getFerieByDipendenteID(this.data._id).then((result) => {
        this.richieste = result;
      });
      this.dataSource = new MatTableDataSource<Ferie>(this.richieste);
        this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit() {
    this.nuovoRichiestaFerie = new Ferie();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(ferie: Ferie, item: string) {
    this.showItemEmiter.emit({ ferie: ferie, button: item });
  }

  async updateFerie(ferie: Ferie) {
    this.ferieService
      .updateFerie(ferie)
      .then((result: Ferie) => {
        const index = this.richieste.indexOf(ferie);
        ferie.closed = true;
        this.richieste[index] = ferie;

        this.dataSource.data = this.richieste;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore modifica stato ferie");
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
      this.updateFerie(row);
    }
  }

  // RICHIESTE EXTERNAL
  async addRichiestaFerie() {
    let dataCurrent = new Date();

    this.addingRichiestaFerie = true;
  }

  async delete(ferie: Ferie) {
    console.log("Cancella Ferie: ", ferie);

    this.ferieService
        .remove(ferie)
        .then((x) => {
          console.log("richisesta cancellata");
          const index = this.richieste.indexOf(ferie);
          console.log("richiesta ferie cancellata index: ", index);
          if (index > -1) {
            this.richieste.splice(index, 1);
          }

          console.log("Richiesta cancellata : ", this.richieste);
          this.dataSource.data = this.richieste;
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



  async saveRichiestaFerie(ferie: Ferie) {
    console.log("Data: ", this.data);
    ferie.user = this.data._id;
    var campi = "";
    if (ferie.dataInizio == undefined || ferie.dataInizio == new Date() || ferie.dataInizio == null) {
      campi = campi + " data Inizio";
    }
    if (ferie.dataFine == undefined || ferie.dataFine == new Date() || ferie.dataFine == null) {
      campi = campi + " data Fine";
    }
    if (campi != "") {
      this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
      this.addingRichiestaFerie = true;
      return;
    }
    if (this.dateDiffInDays(new Date(ferie.dataFine), new Date(ferie.dataInizio)) > 0) {
      this.addingRichiestaFerie = true;
      this.messageService.showMessageError(`Non puoi impostare la data di fine ferie prima della data inizio ferie!!!`);
      return;
    }
    console.log(this.dateDiffInDays(new Date(), new Date((new Date().getFullYear()), 3, 30, 23, 59, 59)));
    if ((this.dateDiffInDays(new Date(ferie.dataInizio), new Date((new Date().getFullYear()), 5, 1)) < 0)
      && this.dateDiffInDays(new Date(), new Date((new Date().getFullYear()), 3, 30, 23, 59, 59))<0
    ) {
      this.addingRichiestaFerie = true;
      this.messageService.showMessageError(`Le ferie estive vanno inserite entro e non oltre il 30 Aprile!!!`);
      return;
    }
    this.uploadingRichiestaFerie = true;
    console.log("Invio Richiesta Ferie: ", ferie);
    this.ferieService
      .insertFerie(ferie)
      .then((result: Ferie) => {
        console.log("Insert Ferie: ", result);
        this.richieste.push(result);
        this.dataSource.data = this.richieste;
        this.addingRichiestaFerie = false;
        this.uploadingRichiestaFerie = false;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore Inserimento RichiestaFerie"
        );
        console.error(err);
      });
  }
}
