import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-admin-pazienti",
  templateUrl: "./admin-pazienti.component.html",
  styleUrls: ["./admin-pazienti.component.css"],
})
export class AdminPazientiComponent implements OnInit {
  pazienti: Paziente[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService
  ) {
    this.pazienti = [];

    console.log("Pazienti Constructor");
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
    var dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });
  }

  getInsertFunction(): any {
    return this.insert.bind({ ...this });
  }

  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();

  //'["Mostra", "Cancella"]'

  insert() {
    console.log("Inserimento Paziente");
    const paziente: Paziente = new Paziente();

    const dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: true, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert paziente", result);
      if (result !== false && result != undefined) {
        this.pazienteService
          .insert(result)
          .then((x) => {
            this.pazienti.push(x);
            this.eventsSubject.next(this.pazienti);
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Inserimento Paziente (" + err["status"] + ")"
            );
          });
      }
      else {
        this.pazienteService.getPazienti().then((paz: Paziente[]) => {
          this.pazienti = paz;
          this.eventsSubject.next(this.pazienti);
        });
      }
    });
  }

  deletePaziente(paziente: Paziente) {
    console.log("Cancella Paziente 1", paziente);
    if (paziente != undefined) {
      this.dialog
        .open(DialogQuestionComponent, {
          data: { message: "Cancellare il paziente?" },
          //width: "600px",
        })
        .afterClosed()
        .subscribe(
          (result) => {
            if (result == true) {
              this.pazienteService.delete(paziente).subscribe(
                (result: Paziente) => {
                  const index = this.pazienti.indexOf(paziente, 0);
                  if (index > -1) {
                    this.pazienti.splice(index, 1);
                  }
                  console.log(
                    "Cancella Paziente eseguita con successo",
                    result
                  );
                  this.eventsSubject.next(this.pazienti);
                },
                (err) =>
                  console.error(`Error Cancellazione paziente: ${err.message}`)
              );
            } else {
              console.log("Cancellazione Paziente annullata");
              this.messageService.showMessageError(
                "Cancellazione Paziente Annullata"
              );
            }
          },
          (err) => console.error(`Error Cancellazione paziente: ${err}`)
        );
    } else {
      this.messageService.showMessageError(
        "Cancellazione Paziente Annullata"
      );
    }
  }

  showAdmin(paziente: Paziente) {
    this.pazienteService
      .getPaziente(paziente._id)
      .then((paziente) => {
        console.log("Area amministrativa pazienti");
        const dialogRef = this.dialog.open(DialogPazienteComponent, {
          data: { paziente: paziente, readonly: true },
        });

        if (dialogRef != undefined)
          dialogRef.afterClosed().subscribe((result) => {
            if (result != undefined) {
              this.pazienteService
                .save(result)
                .then((x) => {})
                .catch((err) => {});
            }
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /*   show(event: { paziente: Paziente; button: DinamicButton }) {
    console.log("Show Event");
    event.button.cmd(event.paziente);
  } */
}
