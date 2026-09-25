import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { VisiteSpecialisticheComponent } from "src/app/component/medica/visite-specialistiche/visite-specialistiche.component";
import { Paziente } from "src/app/models/paziente";
import { VisiteSpecialistiche } from "src/app/models/visiteSpecialistiche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-dialog-visitespecialistiche",
  templateUrl: "./dialog-visitespecialistiche.component.html",
  styleUrls: ["./dialog-visitespecialistiche.component.css"],
})
export class DialogVisitespecialisticheComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: string,
      visitaSpecialistica: VisiteSpecialistiche;
      ccService: CartellaclinicaService,
      readonly: boolean;
    },
     public ccService: CartellaclinicaService,
    public messageService: MessagesService,
    private dialogRef: MatDialogRef<DialogVisitespecialisticheComponent>
  ) { }

  ngOnInit() { }

  async salva() {
    var v = this.data.visitaSpecialistica;

    this.ccService
      .insertVisita(v)
      .then((x) => {
        console.log("Save visita: ", x);
        // Chiudi la dialog passando l'oggetto salvato come risultato
        this.dialogRef.close(x);
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore Inserimento visita (" + err["status"] + ")"
        );
      });
  }
}
