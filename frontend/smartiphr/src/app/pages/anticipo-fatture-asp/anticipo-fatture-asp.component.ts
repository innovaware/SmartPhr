import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { AnticipoFatture } from "src/app/models/anticipoFatture";
import { AnticipoFattureService } from "src/app/service/anticipoFatture.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-anticipo-fatture-asp",
    templateUrl: "./anticipo-fatture-asp.component.html",
    styleUrls: ["./anticipo-fatture-asp.component.css"],
  })
  export class AnticipoFattureASPComponent implements OnInit {
    public uploading: boolean;
    public uploadingAnticipo: boolean;
    public addingAnticipo: boolean;
    public nuovoAnticipo: AnticipoFatture;

    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "action",
    ];
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    dataSource: MatTableDataSource<AnticipoFatture>;
    anticipoFatture: AnticipoFatture[];
  
    constructor(
        public dialog: MatDialog,
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private anticipoFattureService: AnticipoFattureService
    ) {
      this.anticipoFatture = [];
  
      this.anticipoFattureService.getAnticipoFattureAll().subscribe((f: AnticipoFatture[]) => {
        this.anticipoFatture = f;
        this.dataSource = new MatTableDataSource<AnticipoFatture>(this.anticipoFatture);
        this.dataSource.paginator = this.paginator;
      });

      this.uploadingAnticipo = false;
      this.addingAnticipo = false;
    }
  
    ngOnInit() {}
  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
/*     async insert() {
      var dialogRef = this.dialog.open(DialogFattureFornitoriComponent, {});
  
      if (dialogRef != undefined)
        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed");
          if (result != undefined) {
            this.fatture.push(result);
            this.dataSource.data = this.fatture;
            console.log("Inserita anticipo", result);
          }
        });
    } */

    async deleteAnticipo(anticipo: AnticipoFatture) {
        console.log("Cancella anticipo: ", anticipo);
        this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare l anticipo?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            
        this.anticipoFattureService
          .remove(anticipo)
          .then((x) => {
            console.log("Anticipo cancellata");
            const index = this.anticipoFatture.indexOf(anticipo);
            console.log("Anticipo cancellata index: ", index);
            if (index > -1) {
              this.anticipoFatture.splice(index, 1);
            }
    
            console.log("Anticipo cancellata this.anticipoFatture: ", this.anticipoFatture);
            this.dataSource.data = this.anticipoFatture;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione Anticipo");
            console.error(err);
          });

        } else {
            console.log("Cancellazione anticipo annullata");
            this.messageService.showMessageError(
              "Cancellazione anticipo Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione anticipo: ${err}`)
      );
      }

    async addAnticipo() {
        this.addingAnticipo = true;
        this.nuovoAnticipo = {
          identifyUser: "ASPCZ01",
          filename: undefined,
          note: ""
        };
      }
    
      async uploadAnticipo($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload anticipo: ", $event);
          this.nuovoAnticipo.filename = file.name;
          this.nuovoAnticipo.file = file;
    
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async saveAnticipo(anticipo: AnticipoFatture) {
        const typeDocument = "ANTICIPO";
        const path = "anticipo";
        const file: File = anticipo.file;
        this.uploadingAnticipo = true;
    
        console.log("Invio anticipo: ", anticipo);
        this.anticipoFattureService
        .insertAnticipo(anticipo, "ASPCZ01")
        .then((result: AnticipoFatture) => {
          console.log("Insert anticipo: ", result);
          this.anticipoFatture.push(result);
          this.dataSource.data = this.anticipoFatture;
          this.addingAnticipo = false;
          this.uploadingAnticipo = false;
    
          let formData: FormData = new FormData();
    
          const nameDocument: string = anticipo.filename;
    
          formData.append("file", file);
          formData.append("typeDocument", typeDocument);
          formData.append("path", `${"ASPCZ01"}/${path}`);
          formData.append("name", nameDocument);
          this.uploadService
            .uploadDocument(formData)
            .then((x) => {
              this.uploading = false;
    
              console.log("Uploading completed: ", x);
            })
            .catch((err) => {
              this.messageService.showMessageError("Errore nel caricamento file");
              console.error(err);
              this.uploading = false;
            });
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore Inserimento anticipo");
          console.error(err);
        });
      }

    async show(anticipo: AnticipoFatture) {
        this.uploadService
          .download(anticipo.filename, anticipo.identifyUser, "fatture")
          .then((x) => {
            console.log("download: ", x);
            x.subscribe(
              (data) => {
                console.log("download: ", data);
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

  }
  