import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";
import { ContrattoService } from "../../service/contratto.service";
import { Contratto } from "../../models/contratto";
import { ItemDataSourceConsulenti } from "../../models/itemDataSourceConsulenti";
import { ConsulentiService } from "../../service/consulenti.service";

@Component({
    selector: "app-contratti-consulenti",
  templateUrl: "./contratti-consulenti.component.html",
  styleUrls: ["./contratti-consulenti.component.css"],
  })
  export class ContrattiConsulentiComponent implements OnInit {
    displayedColumns: string[] = [
      "filename",
      "dataUpload",
      "dataScadenza",
      "note",
      "nome",
      "cognome",
      "codiceFiscale",
      "action",
    ];
  
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: MatTableDataSource<ItemDataSourceConsulenti>;
  contratti: ItemDataSourceConsulenti[];
  
    constructor(
      public messageService: MessagesService,
      public uploadService: UploadService,
      //   private dialog: MatDialog,
      private consServ: ConsulentiService,
      private contrServ: ContrattoService
    ) {
      this.contratti = [];
      this.dataSource = new MatTableDataSource<ItemDataSourceConsulenti>();
      this.getContrattoConsulente();   
    }
  
    ngOnInit() {}
  
  async getContrattoConsulente() {
    let itemList = [];
    try {
      var contratti = await this.contrServ.getAll();
      contratti = contratti.filter(x => new Date(x.dataScadenza) < new Date());
      for (const x of contratti) {
        const item = new ItemDataSourceConsulenti();
        item.contratto = x;
        try {
          const consulente = await this.consServ.getById(x.idConsulente);
          item.consulente = consulente[0];
        } catch (error) {
          console.error(`Errore nel recupero del consulente con id ${x.idConsulente}`, error);
          item.consulente = null; // Gestione dell'errore, nel caso non venga trovato il consulente
        }
        itemList.push(item);
      }
      this.contratti = itemList;
      this.dataSource.data = this.contratti;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error("Errore nel recupero dei contratti", error);
    }
  }



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

  async show(contratto: Contratto) {
    this.uploadService
      .download(contratto.filename, contratto.idConsulente, 'contratti')
      .then((x) => {
        
        x.subscribe((data) => {
          
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
        });
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
