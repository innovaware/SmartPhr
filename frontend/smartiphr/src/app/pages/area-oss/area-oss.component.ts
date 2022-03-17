import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogArmadioComponent } from "src/app/dialogs/dialog-armadio/dialog-armadio.component";
import { DialogAttivitaComponent } from "src/app/dialogs/dialog-attivita/dialog-attivita.component";
import { DialogPreIngressoComponent } from "src/app/dialogs/dialog-pre-ingresso/dialog-pre-ingresso.component";
import { DialogIngressoComponent } from "src/app/dialogs//dialog-ingresso/dialog-ingresso.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: 'app-area-oss',
  templateUrl: './area-oss.component.html',
  styleUrls: ['./area-oss.component.css']
})
export class AreaOssComponent implements OnInit {
  pazienti: Paziente[];
  customButtons: DinamicButton[];
  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();
 
  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService
  ) {
    console.log("Get Patients");
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }
  
  ngOnInit() {
    this.customButtons = [];
    console.log("Init Area Medica");

    this.customButtons.push({
      label: "Pre-ingresso",
      tooltip: "Pre-ingresso",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogPreIngressoComponent, {
            data: { paziente: paziente, readonly: false },
            width: "1024px",
          })
          .afterClosed()
          .subscribe((data: Paziente) => {
            if (data != undefined || data) {
              this.pazienti.push(data);

              const index = this.pazienti.indexOf(paziente, 0);
              if (index > -1) {
                this.pazienti.splice(index, 1);
                console.log("Removed item");
              }
              this.eventsSubject.next(this.pazienti);
            }
          }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.customButtons.push({
      label: "Ingresso",
      tooltip: "Ingresso",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogIngressoComponent, {
          data: { paziente: paziente, readonly: true },
        }),
    });

    this.customButtons.push({
      label: "Attività",
      tooltip: "Attività",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogIngressoComponent, {
          data: { paziente: paziente, readonly: true },
        }),
    });



    this.customButtons.push({
      label: "Gestione Armadio",
      tooltip: "Armadio",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogIngressoComponent, {
          data: { paziente: paziente, readonly: true },
        }),
    });

  /*  this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });*/


  }

}
