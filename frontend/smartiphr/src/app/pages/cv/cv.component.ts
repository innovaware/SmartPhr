import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogCvComponent } from "src/app/dialogs/dialog-cv/dialog-cv.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Curriculum } from "src/app/models/curriculum";
import { Dipendenti } from "src/app/models/dipendenti";
import { CurriculumService } from "src/app/service/curriculum.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent implements OnInit {
  displayedColumns: string[] = [
    "nome",
    "cognome",
    "codiceFiscale",
    "mansione",
    "dateUpload",
    "status",
    "note",
    "action",
  ];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: MatTableDataSource<Curriculum>;
  curriculum: Curriculum[];

  constructor(
    public messageService: MessagesService,
    public uploadService: UploadService,
    private dialog: MatDialog,
    private curriculumService: CurriculumService
  ) {
    this.curriculum = [];

    this.curriculumService.get().subscribe((curs: Curriculum[]) => {
      this.curriculum = curs;
      this.dataSource = new MatTableDataSource<Curriculum>(this.curriculum);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var dialogRef = this.dialog.open(DialogCvComponent, {
      data: {
        cv: new Curriculum(),
        disabled: false,
        new: true
      },
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        this.curriculumService.get().subscribe((curs: Curriculum[]) => {
          this.curriculum = curs;
          this.dataSource = new MatTableDataSource<Curriculum>(this.curriculum);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  async edit(row: Curriculum) {
    var dialogRef = this.dialog.open(DialogCvComponent, {
      data: {
        cv: row,
        disabled: true,
        new: false
      },
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
      });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        this.curriculumService.get().subscribe((curs: Curriculum[]) => {
          this.curriculum = curs;
          this.dataSource = new MatTableDataSource<Curriculum>(this.curriculum);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  async show(curriculum: Curriculum) {
    this.uploadService
      .download(curriculum.filename, undefined, "curriculum")
      .then((x) => {
        
        x.subscribe(
          (data) => {
            
            const newBlob = new Blob([data as BlobPart], {
              type: "application/pdf",
            });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
            }

            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const downloadURL = URL.createObjectURL(newBlob);
            window.open(downloadURL);
          },
          (err) => {
            this.messageService.showMessageError("Errore caricamento file");
            console.error(err);
          }
        );
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }

  deleteCV(curriculum: Curriculum) {
    console.log("Cancella curriculum:", curriculum);
    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il cv?" },
        //width: "300px",
        //height: "300px"
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            this.curriculumService
              .delete(curriculum)
              .subscribe((result: any) => {
                if (result.deletedCount == 0) {
                  this.messageService.showMessageError(
                    "Errore nell'eliminazione"
                  );
                  console.error("Errore nell'eliminazione");
                } else {
                  console.log("Eliminazione eseguita con successo", result);
                  const index = this.curriculum.indexOf(curriculum, 0);
                  if (index > -1) {
                    this.curriculum.splice(index, 1);
                  }
                  this.dataSource = new MatTableDataSource<Curriculum>(
                    this.curriculum
                  );
                  this.dataSource.paginator = this.paginator;
                }
              }),
              (err) => {
                this.messageService.showMessageError(
                  "Errore nell'eliminazione"
                );
                console.error("Errore nell'eliminazione", err);
              };
          } else {
            console.log("Cancellazione CV annullata");
            this.messageService.showMessageError(
              "Cancellazione Curriculumn Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione curriculumn: ${err}`)
      );
  }
}
