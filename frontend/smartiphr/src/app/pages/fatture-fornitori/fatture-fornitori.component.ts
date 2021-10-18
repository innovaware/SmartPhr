import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
// import { DialogFattureFornitoriComponent } from 'src/app/dialogs/dialog-fatture-fornitori/dialog-fatture-fornitori.component';
import { FattureFornitori } from "src/app/models/fattureFornitori";
import { FattureService } from "src/app/service/fatture.service";
import { FattureFornitoriService } from "src/app/service/fattureFornitori.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
    selector: "app-fatture-fornitori",
    templateUrl: "./fatture-fornitori.component.html",
    styleUrls: ["./fatture-fornitori.component.css"],
  })
  export class FattureFornitoriComponent implements OnInit {
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
    dataSource: MatTableDataSource<FattureFornitori>;
    fattureFornitori: FattureFornitori[];
  
    constructor(
      public messageService: MessagesService,
      public uploadService: UploadService,
    //   private dialog: MatDialog,
      private fattureFornitoriService: FattureFornitoriService
    ) {
      this.fattureFornitori = [];
  
      this.fattureFornitoriService.get().subscribe((curs: FattureFornitori[]) => {
        this.fattureFornitori = curs;
        this.dataSource = new MatTableDataSource<FattureFornitori>(this.fattureFornitori);
        this.dataSource.paginator = this.paginator;
      });
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

    async show(fattura: FattureFornitori) {
        this.uploadService
          .download(fattura.filename, fattura.identifyUserObj, "fatture")
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
    
/*     delete(fattura: FattureFornitori) {
      console.log("Cancella fattura:", fattura);
      this.fattureService.delete(fattura).subscribe((result: any) => {
        if (result.deletedCount == 0) {
          this.messageService.showMessageError("Errore nell'eliminazione");
          console.error("Errore nell'eliminazione");
        } else {
          console.log("Eliminazione eseguita con successo", result);
          const index = this.fatture.indexOf(fattura, 0);
          if (index > -1) {
            this.fatture.splice(index, 1);
          }
          this.dataSource = new MatTableDataSource<FattureFornitori>(this.fatture);
          this.dataSource.paginator = this.paginator;
        }
      }),
        (err) => {
          this.messageService.showMessageError("Errore nell'eliminazione");
          console.error("Errore nell'eliminazione", err);
        };
    } */

  }
  