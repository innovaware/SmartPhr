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
            data: { paziente: paziente},
            width: "1024px",
          }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.customButtons.push({
      images: "",
      label: "Presidi",
      tooltip: "Presidi",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogPresidiPazienteComponent, {
          data: { paziente: paziente },
          width: "1024px",
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




}
