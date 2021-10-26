import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogCartellaInfermeristicaComponent } from 'src/app/dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component';
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
  constructor(public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService) {}

  ngOnInit() {
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }

  show(event: { paziente: Paziente; button: string }) {

    var dialogRef = undefined;

    switch (event.button) {
      case "CC":
        console.log("Cartella Clinica");
        dialogRef = this.dialog.open(DialogCartellaClinicaComponent, {
          data: {paziente: event.paziente, readonly: false}
        });
        break;
      case "CI":
        console.log("Cartella Infermeristica");
        dialogRef = this.dialog.open(DialogCartellaInfermeristicaComponent, {
          data: {paziente: event.paziente, readonly: true}
        });
        break;
      default:
        break;
    }

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        //  this.animal = result;
      });
  }

  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();
 
}
