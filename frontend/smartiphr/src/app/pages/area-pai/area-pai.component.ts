import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogPaiComponent } from "src/app/dialogs/dialog-pai/dialog-pai.component";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { CamereService } from "src/app/service/camere.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";


@Component({
  selector: 'app-area-pai',
  templateUrl: './area-pai.component.html',
  styleUrls: ['./area-pai.component.css']
})
export class AreaPaiComponent implements OnInit {
  pazienti: Paziente[];
  customButtons: DinamicButton[];
  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService,
    private cameraService: CamereService,
  ) {
    console.log("Get Patients");
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }



  ngOnInit() {
    this.customButtons = [];
    console.log("Init PAI");

    this.customButtons.push({
      images: "",
      label: "PAI",
      tooltip: "PAI",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogPaiComponent, {
          data: { paziente: paziente, readonly: true },
          width: "1024px",
        }),
    });


  }
}
