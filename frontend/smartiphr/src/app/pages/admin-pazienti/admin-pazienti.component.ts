import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { Paziente } from "src/app/models/paziente";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-admin-pazienti",
  templateUrl: "./admin-pazienti.component.html",
  styleUrls: ["./admin-pazienti.component.css"],
})
export class AdminPazientiComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public pazienteService: PazienteService
  ) {}

  ngOnInit() {}

  show(event: { paziente: Paziente; button: string }) {
    var dialogRef = undefined;
    console.log("show: ", event);

    this.pazienteService.getPaziente(event.paziente._id).then((paziente) => {
      switch (event.button) {
        case "Mostra":
          console.log("Area amministrativa pazienti");
          dialogRef = this.dialog.open(DialogPazienteComponent, {
            data: { paziente: event.paziente, readonly: true },
          });
          break;

        default:
          break;
      }
    }).catch(err=>{
      console.error(err);
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("resutl", result);
        if (result != undefined) {
          this.pazienteService
            .save(result)
            .then((x) => {})
            .catch((err) => {});
        }
      });
  }
}
