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
  @Input() data: Ferie[];
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
    "cognome",
    "nome",
    "dataInizio",
    "dataFine",
    "dataRichiesta",
    "cf",
    "action",
  ];

  public nuovoRichiestaFerie: Ferie;
  public richieste: Ferie[];
  public uploadingRichiestaFerie: boolean;
  public addingRichiestaFerie: boolean;

  @ViewChild("paginatordocsMedicina", {static: false})
  docsMedicinaPaginator: MatPaginator;
  dataSource: MatTableDataSource<Ferie>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public messageService: MessagesService,
    public ferieService: FerieService
  ) //public dipendenteService: DipendentiService
  {}

  ngOnChanges(changes) {
    this.dataSource = new MatTableDataSource<Ferie>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  // loadTable(){
  //   if(this.isExternal != true){
  //     if(this.data){

  //       this.ferieService.getFerieByDipendente(this.data._id).then((result) => {
  //         this.ferie = result;

  //         this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
  //         this.dataSource.paginator = this.paginator;
  //       });
  //     }
  //     else{
  //     this.ferieService.getFerie().then((result) => {
  //       this.ferie = result;

  //       this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
  //       this.dataSource.paginator = this.paginator;
  //     });
  //     }
  //   }
  //   else{
  //     this.loadUser();
  //   }
  // }

  // loadUser(){
  // this.dipendenteService
  // .getById('620027d56c8df442a73341fa')
  // .then((x) => {
  //       this.dipendente = x;
  //       this.ferieService.getFerieByDipendente(this.dipendente._id).then((result) => {
  //         this.ferie = result;

  //         this.dataSource = new MatTableDataSource<Ferie>(this.ferie);
  //         this.dataSource.paginator = this.paginator;
  //       });
  // })
  // .catch((err) => {
  //   this.messageService.showMessageError(
  //     "Errore Caricamento dipendente (" + err["status"] + ")"
  //   );
  // });
  // }

  ngOnInit() {
    //this.loadTable();
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
        const index = this.data.indexOf(ferie);
        ferie.closed = true;
        this.data[index] = ferie;

        this.dataSource.data = this.data;
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
    // this.nuovoRichiestaFerie = {
    //   dataInizio: undefined,
    //   dataFine: undefined,
    //   nome: this.dipendente.nome,
    //   cognome: this.dipendente.cognome,
    //   cf: this.dipendente.cf,
    //   user: this.dipendente._id,
    //   dataRichiesta:dataCurrent
    // };
  }

  async delete(ferie: Ferie) {
    console.log("Cancella Ferie: ", ferie);

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

  async saveRichiestaFerie(ferie: Ferie) {
    this.uploadingRichiestaFerie = true;

    console.log("Invio Richiesta Ferie: ", ferie);
    this.ferieService
      .insertFerie(ferie)
      .then((result: Ferie) => {
        console.log("Insert Ferie: ", result);
        this.data.push(result);
        this.dataSource.data = this.data;
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
