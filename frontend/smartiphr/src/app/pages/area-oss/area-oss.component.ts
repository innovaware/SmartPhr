import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { DialogArmadioComponent } from "src/app/dialogs/dialog-armadio/dialog-armadio.component";
import { DialogAttivitaComponent } from "src/app/dialogs/dialog-attivita/dialog-attivita.component";
import { DialogPreIngressoComponent } from "src/app/dialogs/dialog-pre-ingresso/dialog-pre-ingresso.component";
import { DialogIngressoComponent } from "src/app/dialogs//dialog-ingresso/dialog-ingresso.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { CamereService } from "src/app/service/camere.service";
import { Camere } from "src/app/models/camere";

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
    public pazienteService: PazienteService,
    private cameraService: CamereService,
  ) {
    console.log("Get Patients");
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);

      this.customButtons = [];
      console.log("Init Area OSS");

      /* this.customButtons.push({
         images: "../../../assets/medico.svg",
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
       });*/

      this.customButtons.push({
        images: "../../../assets/entrance.svg",
        label: "",
        tooltip: "Ingresso",
        cmd: undefined
      });

      this.customButtons.push({
        images: "../../../assets/checklist.svg",
        label: "",
        tooltip: "AttivitĂ ",
        cmd: (paziente: Paziente) =>
          this.dialog.open(DialogAttivitaComponent, {
            data: { paziente: paziente, readonly: true },
            width: "1024px",
          }),
      });



      this.customButtons.push({
        images: "../../../assets/wardrobe.svg",
        label: "",
        tooltip: "Armadio",
        cmd: (paziente: Paziente) =>

          this.cameraService.get(paziente.idCamera).subscribe(
            (camera: Camere) => {
              this.dialog.open(DialogArmadioComponent, {
                data: { camera: camera },
                width: "1024px",
              })
            }
          )
      });


    });
  }

  ngOnInit() {
   
  /*  this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });*/


  }

  showFunction(paziente: Paziente) {
    //console.log(paziente);

    console.log("Show scheda paziente:", paziente);
    var dialogRef = this.dialog.open(DialogIngressoComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });
  }
}
