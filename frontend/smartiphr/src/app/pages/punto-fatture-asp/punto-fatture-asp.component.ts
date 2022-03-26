import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { PuntoFatture } from "src/app/models/puntoFatture";
import { PuntoFattureService } from "src/app/service/puntoFatture.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-punto-fatture-asp",
    templateUrl: "./punto-fatture-asp.component.html",
    styleUrls: ["./punto-fatture-asp.component.css"],
  })
  export class PuntoFattureASPComponent implements OnInit {
    public uploading: boolean;
    public uploadingPunto: boolean;
    public addingPunto: boolean;
    public nuovoPunto: PuntoFatture;

    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "action",
    ];
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<PuntoFatture>;
    puntoFatture: PuntoFatture[];
  
    constructor(
        public dialog: MatDialog,
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private puntoFattureService: PuntoFattureService
    ) {
      this.puntoFatture = [];
  
      this.puntoFattureService.getPuntoFattureAll().subscribe((f: PuntoFatture[]) => {
        this.puntoFatture = f;
        this.dataSource = new MatTableDataSource<PuntoFatture>(this.puntoFatture);
        this.dataSource.paginator = this.paginator;
      });

      this.uploadingPunto = false;
      this.addingPunto = false;
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
            console.log("Inserita punto", result);
          }
        });
    } */

    async deletePunto(punto: PuntoFatture) {
        console.log("Cancella punto: ", punto);
        this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare l punto?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            
        this.puntoFattureService
          .remove(punto)
          .then((x) => {
            console.log("Punto cancellata");
            const index = this.puntoFatture.indexOf(punto);
            console.log("Punto cancellata index: ", index);
            if (index > -1) {
              this.puntoFatture.splice(index, 1);
            }
    
            console.log("Punto cancellata this.puntoFatture: ", this.puntoFatture);
            this.dataSource.data = this.puntoFatture;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione Punto");
            console.error(err);
          });

        } else {
            console.log("Cancellazione punto annullata");
            this.messageService.showMessageError(
              "Cancellazione punto Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione punto: ${err}`)
      );
      }

    async addPunto() {
        this.addingPunto = true;
        this.nuovoPunto = {
          identifyUser: "ASPCZ01",
          filename: undefined,
          note: ""
        };
      }
    
      async uploadPunto($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload punto: ", $event);
          this.nuovoPunto.filename = file.name;
          this.nuovoPunto.file = file;
    
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async savePunto(punto: PuntoFatture) {
        const typeDocument = "PUNTOFATTURE";
        const path = "puntofatture";
        const file: File = punto.file;
        this.uploadingPunto = true;
    
        console.log("Invio punto: ", punto);
        this.puntoFattureService
        .insertPunto(punto, "ASPCZ01")
        .then((result: PuntoFatture) => {
          console.log("Insert punto: ", result);
          this.puntoFatture.push(result);
          this.dataSource.data = this.puntoFatture;
          this.addingPunto = false;
          this.uploadingPunto = false;
    
          let formData: FormData = new FormData();
    
          const nameDocument: string = punto.filename;
    
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
          this.messageService.showMessageError("Errore Inserimento punto");
          console.error(err);
        });
      }

    async show(punto: PuntoFatture) {
        this.uploadService
          .download(punto.filename, punto.identifyUser, "puntofatture")
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
  