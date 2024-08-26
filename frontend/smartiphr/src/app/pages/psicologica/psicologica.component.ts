import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { DialogPisicologicaComponent } from "src/app/dialogs/dialog-psicologica/dialog-psicologica.component";
import { Diario } from "src/app/models/diario";
import { Paziente } from "src/app/models/paziente";
import { schedaPsico } from "src/app/models/schedaPsico";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-pisicologica",
  templateUrl: "./psicologica.component.html",
  styleUrls: ["./psicologica.component.css"],
})
export class PsicologicaComponent implements OnInit {
  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();
  pazienti: Paziente[];

  constructor(
    public pazienteService: PazienteService,
    public messageService: MessagesService,
    public dialog: MatDialog
  ) {
    this.pazienti = [];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }

  showFunction(paziente: Paziente) {
    //console.log(paziente);

    console.log("Show scheda paziente:", paziente);
    var dialogRef = this.dialog.open(DialogPisicologicaComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });

    dialogRef.afterClosed().subscribe((result: schedaPsico) => {
      console.log("result insert paziente", result);
      if (result != undefined) {
        this.pazienteService
          .updateschedaPsicologica(paziente._id, result)
          .subscribe(
            (succ) => {
              console.log("Scheda Psicologica Aggiornata. Result:", succ);
              paziente.schedaPsico = result;
            },
            (err) => {
              this.messageService.showMessageError(
                "Errore Inserimento Paziente (" + err["status"] + ")"
              );
            }
          );
      }
    });
  }
}
