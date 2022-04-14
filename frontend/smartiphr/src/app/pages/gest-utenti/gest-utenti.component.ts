import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { MessagesService } from "src/app/service/messages.service";
import { DipendentiService } from "src/app/service/dipendenti.service";

@Component({
  selector: "app-gest-utenti",
  templateUrl: "./gest-utenti.component.html",
  styleUrls: ["./gest-utenti.component.css"],
})
export class GestUtentiComponent implements OnInit {
  dipendenti: Dipendenti[];
  /*
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Dipendenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  data: Dipendenti[];

  constructor(
    public dialog: MatDialog,
    public utentiService: DipendentiService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.utentiService.get().then((result) => {
      this.data = result;

      this.dataSource = new MatTableDataSource<Dipendenti>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var dipendente: Dipendenti = {
      cognome: "",
      nome: "",
      email: "",
      cf: "",
      indirizzoNascita: "",
      comuneNascita: "",
      provinciaNascita: "",
      dataNascita: null,
      indirizzoResidenza: "",
      residenza: "",
      luogoResidenza: "",
      provinciaResidenza: "",
      titoloStudio: "",
      mansione: "",
      contratto: "",
      telefono: "",
      group: "",
      user: "",
    };

    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.utentiService.insert(result.dipendente).then((r: Dipendenti) => {
            this.data.push(r);
            this.dataSource.data = this.data;
          });
        }
      });
  }

  async show(dipendente: Dipendenti) {
    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          console.debug("Update dipendente: ", result.dipendente);
          this.utentiService.save(result.dipendente).then(r=>{
            console.log("Modifica eseguita con successo");
          }).catch(err=> {
            console.error("Errore aggiornamento dipendente", err);
          })
        }
      });
  }

  */



  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public dipendentiService: DipendentiService
  ) {}

  ngOnInit() {
    this.dipendentiService.get().then((dip: Dipendenti[]) => {
      this.dipendenti = dip;

      this.eventsSubject.next(this.dipendenti);
    });
  }

  eventsSubject: Subject<Dipendenti[]> = new Subject<Dipendenti[]>();

  showFunction(dipendente: Dipendenti) {
    //console.log(paziente);

    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
      width: "1024px",
    });
  }

  show(event: { dipendente: Dipendenti; button: string }) {
    var dialogRef = undefined;
    console.log("show: ", event);

    this.dipendentiService.getById(event.dipendente._id).then((paziente) => {
      switch (event.button) {
        case "Mostra":
          console.log("Area amministrativa pazienti");
          dialogRef = this.dialog.open(DialogDipendenteComponent, {
            data: { dipendente: event.dipendente, readonly: true },
          });
          break;

        default:
          break;
      }
    }).catch(err=>{
      console.error(err);
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("resutl", result);
        if (result != undefined) {
          this.dipendentiService
            .save(result)
            .then((x) => {})
            .catch((err) => {});
        }
      });
  }



}
