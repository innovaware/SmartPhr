import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { NotaCredito } from "src/app/models/notacredito";
import { NotaCreditoService } from "src/app/service/notacredito.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-note-credito-asp",
    templateUrl: "./note-credito-asp.component.html",
    styleUrls: ["./note-credito-asp.component.css"],
  })
  export class NoteCreditoASPComponent implements OnInit {
    public uploading: boolean;
    public uploadingNota: boolean;
    public addingNota: boolean;
    public nuovaNota: NotaCredito;

    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "action",
    ];
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<NotaCredito>;
    notaCredito: NotaCredito[];
  
    constructor(
        public dialog: MatDialog,
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private notaCreditoService: NotaCreditoService
    ) {
      this.notaCredito = [];
  
      this.notaCreditoService.getByUserId("ASPCZ01").then((n: NotaCredito[]) => {
        this.notaCredito = n;
        this.dataSource = new MatTableDataSource<NotaCredito>(this.notaCredito);
        this.dataSource.paginator = this.paginator;
      });

      this.uploadingNota = false;
      this.addingNota = false;
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

    async deleteNota(nota: NotaCredito) {
        console.log("Cancella nota: ", nota);
        this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare nota?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe(
        (result) => {
          if (result == true) {
            
        this.notaCreditoService
          .remove(nota)
          .then((x) => {
            console.log("nota cancellata");
            const index = this.notaCredito.indexOf(nota);
            console.log("nota cancellata index: ", index);
            if (index > -1) {
              this.notaCredito.splice(index, 1);
            }
    
            console.log("nota cancellata this.notaCredito: ", this.notaCredito);
            this.dataSource.data = this.notaCredito;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione nota");
            console.error(err);
          });

        } else {
            console.log("Cancellazione nota annullata");
            this.messageService.showMessageError(
              "Cancellazione nota Annullata"
            );
          }
        },
        (err) => console.error(`Error Cancellazione nota: ${err}`)
      );
      }

    async addNota() {
        this.addingNota = true;
        this.nuovaNota = {
          identifyUser: "ASPCZ01",
          filename: undefined,
          note: ""
        };
      }
    
      async uploadNota($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload nota: ", $event);
          this.nuovaNota.filename = file.name;
          this.nuovaNota.file = file;
    
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async saveNota(nota: NotaCredito) {
        const typeDocument = "NOTACREDITO";
        const path = "notacredito";
        const file: File = nota.file;
        this.uploadingNota = true;
    
        console.log("Invio nota: ", nota);
        this.notaCreditoService
        .insert(nota, "ASPCZ01")
        .then((result: NotaCredito) => {
          console.log("Insert nota: ", result);
          this.notaCredito.push(result);
          this.dataSource.data = this.notaCredito;
          this.addingNota = false;
          this.uploadingNota = false;
    
          let formData: FormData = new FormData();
    
          const nameDocument: string = nota.filename;
    
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
          this.messageService.showMessageError("Errore Inserimento nota");
          console.error(err);
        });
      }

    async show(nota: NotaCredito) {
        this.uploadService
          .download(nota.filename, nota.identifyUser, "notacredito")
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
  