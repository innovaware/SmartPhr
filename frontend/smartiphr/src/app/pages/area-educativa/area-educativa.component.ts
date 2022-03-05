import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";

import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { DialogCartellaEducativaComponent } from 'src/app/dialogs/dialog-cartella-educativa/dialog-cartella-educativa.component';

@Component({
  selector: 'app-area-educativa',
  templateUrl: './area-educativa.component.html',
  styleUrls: ['./area-educativa.component.css']
})
export class AreaEducativaComponent implements OnInit {

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
    console.log("Init Area Educativa");

    this.customButtons.push({
      images: "../../../assets/medico.svg",
      label: "",
      tooltip: "Cartella Educativa",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaEducativaComponent, {
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


  }


  show(paziente: Paziente) {

  }
}


