import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";

import { FornitoreGeneraleComponent } from "src/app/component/fornitore-generale/fornitore-generale.component";
import { Fatture } from "src/app/models/fatture";
import { DocumentoFornitore } from "src/app/models/documentoFornitore";
import { Fornitore } from "src/app/models/fornitore";
import { BonificoService } from "src/app/service/bonifico.service";
import { FattureService } from "src/app/service/fatture.service";
import { DocumentoFornitoreService } from "src/app/service/documentoFornitore.service";
import { MessagesService } from "src/app/service/messages.service";
import { FornitoreService } from "src/app/service/fornitore.service";
import { UploadService } from "src/app/service/upload.service";

@Component({
  selector: "app-dialog-fornitore",
  templateUrl: "./table-fatture-fornitori.component.html",
  styleUrls: ["./table-fatture-fornitori.component.css"],
})
export class TableFattureFornitoriComponent implements OnInit {
  public fornitore: Fornitore;
  public newItem: boolean;
  public document: any[] = [];

  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public fattureDataSource: MatTableDataSource<Fatture>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  @ViewChild("paginatorFatture", { static: false })
  fatturePaginator: MatPaginator;

  public fatture: Fatture[];

  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<FornitoreGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { fornitore: Fornitore; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public fornitoreService: FornitoreService,
    public messageService: MessagesService,
    public dialog: MatDialog
  ) {
    this.fornitore = this.data.fornitore;
    this.newItem = this.data.newItem || false;

    //this.fornitore = JSON.parse(JSON.stringify(this.data.fornitore));
    console.log("Dialog fornitore generale", this.data);
  }

  async getFatture() {
    console.log(`Get Fatture fornitore: ${this.fornitore._id}`);
    this.fattureService
      .getByUserId(this.fornitore._id)
      .then((f: Fatture[]) => {
        this.fatture = f;

        this.fattureDataSource = new MatTableDataSource<Fatture>(this.fatture);
        this.fattureDataSource.paginator = this.fatturePaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista fatture"
        );
        console.error(err);
      });
  }

  async showFattureDocument(fattura: Fatture) {
    this.uploadService
      .download(fattura.filename, this.fornitore._id, "fatture")
      .then((x) => {
        console.log("download: ", x);
        x.subscribe((data) => {
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
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }

  ngOnInit() {
    if (this.fornitore._id != undefined) {
      this.getFatture();
    }
  }

  applyFilter($event) {}
  deleteFattura(row) {}
}
