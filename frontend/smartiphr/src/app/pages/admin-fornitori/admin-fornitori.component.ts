import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { DialogFornitoreComponent } from 'src/app/dialogs/dialog-fornitore/dialog-fornitore.component';
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Fornitore } from "src/app/models/fornitore";
import { MessagesService } from 'src/app/service/messages.service';
import { FornitoreService } from "src/app/service/fornitore.service";

@Component({
  selector: "app-admin-fornitori",
  templateUrl: "./admin-fornitori.component.html",
  styleUrls: ["./admin-fornitori.component.css"],
})
export class AdminFornitoriComponent implements OnInit {
  fornitori: Fornitore[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public fornitoreService: FornitoreService
  ) {}

  ngOnInit() {
    this.fornitoreService.getFornitori().then((forn: Fornitore[]) => {
      this.fornitori = forn;

      this.eventsSubject.next(this.fornitori);
    });
  }


  getButtons() {
    const showButton: DinamicButton = {
      label: "Mostra",
      icon: "",
      cmd: this.showAdmin.bind({ ...this }),
    };

    const deleteButton: DinamicButton = {
      label: "Cancella",
      icon: "",
      cmd: this.deleteAdmin.bind({ ...this }),
    };

    return [showButton, deleteButton];
  }

  getInsertFunction(): any {
    return this.insert.bind({...this})
  }

  eventsSubject: Subject<Fornitore[]> = new Subject<Fornitore[]>();

  //'["Mostra", "Cancella"]'

  insert() {
    console.log("Inserimento Fornitore");
    const fornitore: Fornitore = new Fornitore();

    const dialogRef = this.dialog.open(DialogFornitoreComponent, {
      data: { fornitore: fornitore, readonly: true, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert fornitore", result);
      if (result !== false && result != undefined) {

        this.fornitoreService
          .insert(result)
          .then((x) => {
            this.fornitori.push(x);
            this.eventsSubject.next(this.fornitori);
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Inserimento Fornitore (" + err["status"] + ")"
            );
          });
      }
    });
  }

  deleteAdmin(fornitore: Fornitore) {
    console.log("Cancella fornitore");
    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il fornitore?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {

    this.fornitoreService.delete(fornitore).then(
      (x) => {
        const index = this.fornitori.indexOf(fornitore);
        if (index > -1) {
          this.fornitori.splice(index, 1);
        }
        console.log("Cancella Fornitore eseguita con successo");
        this.eventsSubject.next(this.fornitori);
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Fornitore");
  console.error(err);
      });
  } else {
    console.log("Cancellazione fornitore annullata");
    this.messageService.showMessageError(
      "Cancellazione Paziente Annullata"
    );
  }
},
(err) => console.error(`Error Cancellazione fornitore: ${err}`)
);

  }

  showAdmin(fornitore: Fornitore) {
    this.fornitoreService
      .getFornitore(fornitore._id)
      .then((fornitore) => {
        console.log("Area amministrativa fornitori");
        const dialogRef = this.dialog.open(DialogFornitoreComponent, {
          data: { fornitore: fornitore, readonly: true },
        });

        if (dialogRef != undefined)
          dialogRef.afterClosed().subscribe((result) => {
            if (result != undefined) {
              this.fornitoreService
                .save(result)
                .then((x) => {})
                .catch((err) => {});
            }
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }


  show(event: { fornitore: Fornitore; button: DinamicButton }) {
    console.log("Show Event");
    event.button.cmd(event.fornitore);
  }

}
