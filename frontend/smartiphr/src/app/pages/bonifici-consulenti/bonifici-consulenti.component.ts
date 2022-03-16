import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { BonificiConsulenti } from "src/app/models/bonificiConsulenti";
import { BonificiConsulentiService } from "src/app/service/bonificiConsulenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-bonifici-consulenti",
    templateUrl: "./bonifici-consulenti.component.html",
    styleUrls: ["./bonifici-consulenti.component.css"],
  })
  export class BonificiConsulentiComponent implements OnInit {
    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "note",
      "nome",
      "cognome",
      "codiceFiscale",
      "action",
    ];
  
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    dataSource: MatTableDataSource<BonificiConsulenti>;
    bonificiConsulenti: BonificiConsulenti[];
  
    constructor(
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private bonificiConsulentiService: BonificiConsulentiService
    ) {
      this.bonificiConsulenti = [];
  
      this.bonificiConsulentiService.get().subscribe((curs: BonificiConsulenti[]) => {
        this.bonificiConsulenti = curs;
        this.dataSource = new MatTableDataSource<BonificiConsulenti>(this.bonificiConsulenti);
        this.dataSource.paginator = this.paginator;
      });
    }
  
    ngOnInit() {}
  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
/*     async insert() {
      var dialogRef = this.dialog.open(DialogBonificiConsulentiComponent, {});
  
      if (dialogRef != undefined)
        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed");
          if (result != undefined) {
            this.bonifici.push(result);
            this.dataSource.data = this.bonifici;
            console.log("Inserita bonifico", result);
          }
        });
    } */

    async show(bonifico: BonificiConsulenti) {
        this.uploadService
          .download(bonifico.filename, bonifico.identifyUserObj, "bonifico")
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
    
/*     delete(bonifico: BonificiConsulenti) {
      console.log("Cancella bonifico:", bonifico);
      this.bonificiService.delete(bonifico).subscribe((result: any) => {
        if (result.deletedCount == 0) {
          this.messageService.showMessageError("Errore nell'eliminazione");
          console.error("Errore nell'eliminazione");
        } else {
          console.log("Eliminazione eseguita con successo", result);
          const index = this.bonifici.indexOf(bonifico, 0);
          if (index > -1) {
            this.bonifici.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource<BonificiConsulenti>(this.bonifici);
          this.dataSource.paginator = this.paginator;
        }
      }),
        (err) => {
          this.messageService.showMessageError("Errore nell'eliminazione");
          console.error("Errore nell'eliminazione", err);
        };
    } */

  }
  