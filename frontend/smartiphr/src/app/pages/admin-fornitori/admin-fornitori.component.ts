import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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

  showFunction(data: Fornitore) {
    //console.log(paziente);

    console.log("Show scheda fornitore:", data);
    var dialogRef = this.dialog.open(DialogFornitoreComponent, {
      data: { fornitore: data, readonly: false },
      width: "1024px",
    });
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
      else {
        this.fornitoreService.getFornitori().then((forn: Fornitore[]) => {
          this.fornitori = forn;   
          this.eventsSubject.next(this.fornitori);
        });
      }
    });
  }

  deleteAdmin(data: Fornitore) {
    console.log("Cancella Fornitore ", data);
    if (data != undefined) {
      this.dialog
        .open(DialogQuestionComponent, {
          data: { message: "Cancellare il fornitore?" },
          //width: "600px",
        })
        .afterClosed()
        .subscribe(
          (result) => {
            if (result == true) {
              this.fornitoreService.delete(data).subscribe(
                (result: Fornitore) => {
                  const index = this.fornitori.indexOf(data, 0);
                  if (index > -1) {
                    this.fornitori.splice(index, 1);
                  }
                  console.log(
                    "Cancella Paziente eseguita con successo",
                    result
                  );
                  this.eventsSubject.next(this.fornitori);
                },
                (err) =>
                  console.error(`Error Cancellazione fornitore: ${err.message}`)
              );
            } else {
              console.log("Cancellazione fornitore annullata");
              this.messageService.showMessageError(
                "Cancellazione fornitore Annullata"
              );
            }
          },
          (err) => console.error(`Error Cancellazione fornitore: ${err}`)
        );
    } else {
      this.messageService.showMessageError(
        "Cancellazione fornitore Annullata"
      );
    }
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
