import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogCartellaInfermeristicaComponent } from 'src/app/dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component';
import { Paziente } from "src/app/models/paziente";

@Component({
  selector: "app-area-medica",
  templateUrl: "./area-medica.component.html",
  styleUrls: ["./area-medica.component.css"],
})
export class AreaMedicaComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

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
}
