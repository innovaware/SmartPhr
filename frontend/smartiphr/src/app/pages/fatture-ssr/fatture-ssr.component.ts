import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Fatture } from "src/app/models/fatture";
import { FattureService } from "src/app/service/fatture.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-fatture-ssr",
    templateUrl: "./fatture-ssr.component.html",
    styleUrls: ["./fatture-ssr.component.css"],
  })
  export class FattureSSRComponent implements OnInit {
    public uploading: boolean;
    public uploadingFattura: boolean;
    public addingFattura: boolean;
    public nuovaFattura: Fatture;

    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "action",
    ];
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    dataSource: MatTableDataSource<Fatture>;
    fattureSSR: Fatture[];
  
    constructor(
        public dialog: MatDialog,
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private fattureSSRService: FattureService
    ) {
      this.fattureSSR = [];
  
      this.fattureSSRService.getFatture("ASPCZ01").then((f: Fatture[]) => {
        this.fattureSSR = f;
        this.dataSource = new MatTableDataSource<Fatture>(this.fattureSSR);
        this.dataSource.paginator = this.paginator;
      });

      this.uploadingFattura = false;
      this.addingFattura = false;
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
            console.log("Inserita fattura", result);
          }
        });
    } */

    async deleteFattura(fattura: Fatture) {
        console.log("Cancella fattura: ", fattura);
        this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare la fattura?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            
        this.fattureSSRService
          .remove(fattura)
          .then((x) => {
            console.log("Fattura cancellata");
            const index = this.fattureSSR.indexOf(fattura);
            console.log("Fattura cancellata index: ", index);
            if (index > -1) {
              this.fattureSSR.splice(index, 1);
            }
    
            console.log("Fattura cancellata this.fatture: ", this.fattureSSR);
            this.dataSource.data = this.fattureSSR;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione Fattura");
            console.error(err);
          });

        } else {
            console.log("Cancellazione fattura annullata");
            this.messageService.showMessageError(
              "Cancellazione fattura Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione fattura: ${err}`)
      );
      }

    async addFattura() {
        this.addingFattura = true;
        this.nuovaFattura = {
          identifyUser: "ASPCZ01",
          filename: undefined,
          note: ""
        };
      }
    
      async uploadFattura($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload fattura: ", $event);
          this.nuovaFattura.filename = file.name;
          this.nuovaFattura.file = file;
    
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async saveFattura(fattura: Fatture) {
        const typeDocument = "FATTURE";
        const path = "fatture";
        const file: File = fattura.file;
        this.uploadingFattura = true;
    
        console.log("Invio fattura: ", fattura);
        this.fattureSSRService
        .insertFattura(fattura, "ASPCZ01")
        .then((result: Fatture) => {
          console.log("Insert fattura: ", result);
          this.fattureSSR.push(result);
          this.dataSource.data = this.fattureSSR;
          this.addingFattura = false;
          this.uploadingFattura = false;
    
          let formData: FormData = new FormData();
    
          const nameDocument: string = fattura.filename;
    
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
          this.messageService.showMessageError("Errore Inserimento fattura");
          console.error(err);
        });
      }

    async show(fattura: Fatture) {
        this.uploadService
          .download(fattura.filename, fattura.identifyUser, "fatture")
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
  