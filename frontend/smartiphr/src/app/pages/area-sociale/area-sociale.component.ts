import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogCartellaClinicaComponent } from "src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "src/app/dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";
import { DialogCartellaAssistenteSocialeComponent } from "src/app/dialogs/dialog-cartella-assistente-sociale/dialog-cartella-assistente-sociale.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: 'app-area-sociale',
  templateUrl: './area-sociale.component.html',
  styleUrls: ['./area-sociale.component.css']
})
export class AreaSocialeComponent implements OnInit {

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
    this.customButtons = [];
    this.customButtons.push({
        images: "../../../assets/medico.svg",
        label: "",
        tooltip: "Cartella Assistente Sociale",
        cmd: undefined
    });
  }

  ngOnInit() {
    console.log("Init Area Sociale");

    //this.customButtons.push({
    //  images: "../../../assets/medico.svg",
    //  label: "",
    //  tooltip: "Cartella Assistente Sociale",
    //  cmd: (paziente: Paziente) =>
    //    this.dialog.open(DialogCartellaAssistenteSocialeComponent, {
    //        data: { paziente: paziente, readonly: false },
    //        width: "1024px",
    //      })
    //      //.afterClosed()
    //      //.subscribe((data: Paziente) => {
    //      //  if (data != undefined || data) {
    //      //    this.pazienti.push(data);

    //      //    const index = this.pazienti.indexOf(paziente, 0);
    //      //    if (index > -1) {
    //      //      this.pazienti.splice(index, 1);
    //      //      console.log("Removed item");
    //      //    }
    //      //    this.eventsSubject.next(this.pazienti);
    //      //  }
    //      //}),
    //  //css: "mat-raised-button raised-button action-button",
    //});
  }



  showFunction(paziente: Paziente) {
    //console.log(paziente);

    console.log("Show scheda sociale paziente:", paziente);
    var dialogRef = this.dialog.open(DialogCartellaAssistenteSocialeComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });
  }

}
