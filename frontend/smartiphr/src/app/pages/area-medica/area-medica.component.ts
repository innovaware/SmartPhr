import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogCartellaClinicaComponent } from "src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "src/app/dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-area-medica",
  templateUrl: "./area-medica.component.html",
  styleUrls: ["./area-medica.component.css"],
})
export class AreaMedicaComponent implements OnInit {
  pazienti: Paziente[];
  customButtons: DinamicButton[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService
  ) {}

  ngOnInit() {
    this.customButtons = [];
    console.log("Init Area Medica");

    this.customButtons.push({
      icon: "",
      label: "CC",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaClinicaComponent, {
          data: { paziente: paziente, readonly: false },
        }),
      css: "mat-raised-button raised-button action-button",
    });

    this.customButtons.push({
      icon: "",
      label: "CI",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaInfermeristicaComponent, {
          data: { paziente: paziente, readonly: true },
        }),
      css: "mat-raised-button raised-button action-button",
    });

    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }

  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();
}
