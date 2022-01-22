import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogRiabilitazioneComponent } from "src/app/dialogs/dialog-riabilitazione/dialog-riabilitazione.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";

@Component({
  selector: "app-area-fisioterapia",
  templateUrl: "./area-fisioterapia.component.html",
  styleUrls: ["./area-fisioterapia.component.css"],
})
export class AreaFisioterapiaComponent implements OnInit {
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
    console.log("Init Area Infermeristica");

    this.customButtons.push({
      images: "../../../assets/rehabilitation.png",
      label: "",
      tooltip: "Cartella Riabilitativa",
      cmd: (paziente: Paziente) =>
        this.dialog
          .open(DialogRiabilitazioneComponent, {
            data: { paziente: paziente, readonly: true },
            width: "1024px",
            height: "800px",
          })
          .afterClosed()
          .subscribe((result: Paziente) => {
            if (result != undefined) {
              const index = this.pazienti.findIndex(
                (x) => x._id == paziente._id
              );
              if (index > -1) {
                this.pazienti.splice(index, 1);
                // this.pazienti.push(result);
                this.pazienti.splice(index, 0, result);
                this.eventsSubject.next(this.pazienti);
              }
            }
          }),
    });

    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }
}
