import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { ProspettoCM } from "src/app/models/prospettoCM";
import { ProspettoCMService } from "src/app/service/prospettoCM.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-prospetto-cm-asp",
    templateUrl: "./prospetto-cm-asp.component.html",
    styleUrls: ["./prospetto-cm-asp.component.css"],
  })
  export class ProspettoCMASPComponent implements OnInit {
    public uploading: boolean;
    public uploadingProspetto: boolean;
    public addingProspetto: boolean;
    public nuovoProspetto: ProspettoCM;

    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "action",
    ];
  
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    dataSource: MatTableDataSource<ProspettoCM>;
    prospettoCM: ProspettoCM[];
  
    constructor(
        public dialog: MatDialog,
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private prospettoCMService: ProspettoCMService
    ) {
      this.prospettoCM = [];
  
      this.prospettoCMService.getProspettoCMAll().subscribe((p: ProspettoCM[]) => {
        this.prospettoCM = p;
        this.dataSource = new MatTableDataSource<ProspettoCM>(this.prospettoCM);
        this.dataSource.paginator = this.paginator;
      });

      this.uploadingProspetto = false;
      this.addingProspetto = false;
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

    async deleteProspetto(prospetto: ProspettoCM) {
        console.log("Cancella prospetto: ", prospetto);
        this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il prospetto?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            
        this.prospettoCMService
          .remove(prospetto)
          .then((x) => {
            console.log("Anticipo cancellata");
            const index = this.prospettoCM.indexOf(prospetto);
            console.log("Anticipo cancellata index: ", index);
            if (index > -1) {
              this.prospettoCM.splice(index, 1);
            }
    
            console.log("Prospetto cancellata this.prospettoCM: ", this.prospettoCM);
            this.dataSource.data = this.prospettoCM;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione prospetto");
            console.error(err);
          });

        } else {
            console.log("Cancellazione prospetto annullata");
            this.messageService.showMessageError(
              "Cancellazione prospetto Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione prospetto: ${err}`)
      );
      }

    async addProspetto() {
        this.addingProspetto = true;
        this.nuovoProspetto = {
          identifyUser: "ASPCZ01",
          filename: undefined,
          note: ""
        };
      }
    
      async uploadProspetto($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload Prospetto: ", $event);
          this.nuovoProspetto.filename = file.name;
          this.nuovoProspetto.file = file;
    
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async saveProspetto(prospetto: ProspettoCM) {
        const typeDocument = "PROSPETTOCM";
        const path = "prospettocm";
        const file: File = prospetto.file;
        this.uploadingProspetto = true;
    
        console.log("Invio Prospetto: ", prospetto);
        this.prospettoCMService
        .insertProspettoCM(prospetto, "ASPCZ01")
        .then((result: ProspettoCM) => {
          console.log("Insert anticipo: ", result);
          this.prospettoCM.push(result);
          this.dataSource.data = this.prospettoCM;
          this.addingProspetto = false;
          this.uploadingProspetto = false;
    
          let formData: FormData = new FormData();
    
          const nameDocument: string = prospetto.filename;
    
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

    async show(prospetto: ProspettoCM) {
        this.uploadService
          .download(prospetto.filename, prospetto.identifyUser, "prospettocm")
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
  