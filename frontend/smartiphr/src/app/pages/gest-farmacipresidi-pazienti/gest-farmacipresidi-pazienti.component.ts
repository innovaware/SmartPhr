import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogFarmaciPazienteComponent } from "src/app/dialogs/dialog-farmaci-paziente/dialog-farmaci-paziente.component";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DialogPresidiPazienteComponent } from "src/app/dialogs/dialog-presidi-paziente/dialog-presidi-paziente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: 'app-gest-farmacipresidi-pazienti',
  templateUrl: './gest-farmacipresidi-pazienti.component.html',
  styleUrls: ['./gest-farmacipresidi-pazienti.component.css']
})
export class GestFarmacipresidiPazientiComponent implements OnInit {

  pazienti: Paziente[];
  customButtons: DinamicButton[];
  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService
  ) {
    this.pazienti = [];

    console.log("Pazienti Constructor");
  }

  ngOnInit() {
    this.customButtons = [];
    console.log("Init Area Medica");

    this.customButtons.push({
      images: "",
      label: "Farmaci",
      tooltip: "Farmaci",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogFarmaciPazienteComponent, {
            data: { paziente: paziente, readonly: false, altro: false },
            width: "1024px",
          })
          .afterClosed()
          .subscribe((data: Paziente) => {
             if (data != undefined || data) {
            //   this.pazienti.push(data);

            //   const index = this.pazienti.indexOf(paziente, 0);
            //   if (index > -1) {
            //     this.pazienti.splice(index, 1);
            //     console.log("Removed item");
            //   }
            //   this.eventsSubject.next(this.pazienti);
            console.log("Area Farmaci Update Paziente");
            Paziente.refresh(data, paziente);
            }
          }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.customButtons.push({
      images: "",
      label: "Presidi",
      tooltip: "Presidi",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogPresidiPazienteComponent, {
          data: { paziente: paziente, readonly: true },
        }),
      //css: "mat-raised-button raised-button action-button",
    });




    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });


  }

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


}
