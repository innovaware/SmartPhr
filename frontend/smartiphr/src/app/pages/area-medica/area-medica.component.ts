import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogCartellaClinicaComponent } from "src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component";
import { DialogCartellaInfermeristicaComponent } from "src/app/dialogs/dialog-cartella-infermeristica/dialog-cartella-infermeristica.component";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
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
      images: "../../../assets/medico.svg",
      label: "",
      tooltip: "Cartella Clinica",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaClinicaComponent, {
            data: { paziente: paziente, readonly: false, altro: false },
            width: "1024px",
          })
          .afterClosed()
          .subscribe((data: Paziente) => {
             if (data != undefined || data) {
            //   this.pazienti.push(data);

            //   const index = this.pazienti.indexOf(paziente, 0);
            //   if (index > -1) {
            //     this.pazienti.splice(index, 1);
            //     console.log("Removed item");
            //   }
            //   this.eventsSubject.next(this.pazienti);
            console.log("Area Infermeristica Update Paziente");
            Paziente.refresh(data, paziente);
            }
          }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.customButtons.push({
      images: "../../../assets/areaInfermeristica.svg",
      label: "",
      tooltip: "Cartella Infermeristica",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaInfermeristicaComponent, {
          data: { paziente: paziente, readonly: true },
        }),
      //css: "mat-raised-button raised-button action-button",
    });



    this.customButtons.push({
      images: "../../../assets/book-medical-solid.svg",
      label: "",
      tooltip: "Altro",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogCartellaClinicaComponent, {
          data: { paziente: paziente, readonly: true, altro: true },
        }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });


  }


  ngAfterViewInit() {
    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
  }

  showFunction(paziente: Paziente) {
    //console.log(paziente);

    console.log("Show scheda paziente:", paziente);
    var dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });
  }

  getInsertFunction(): any {
    return this.insert.bind({ ...this });
  }


  //'["Mostra", "Cancella"]'

  insert() {
    console.log("Inserimento Paziente");
    const paziente: Paziente = new Paziente();

    const dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: true, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert paziente", result);
      if (result !== false && result != undefined) {
        this.pazienteService
          .insert(result)
          .then((x) => {
            this.pazienti.push(x);
            this.eventsSubject.next(this.pazienti);
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Inserimento Paziente (" + err["status"] + ")"
            );
          });
      }
    });
  }

}
