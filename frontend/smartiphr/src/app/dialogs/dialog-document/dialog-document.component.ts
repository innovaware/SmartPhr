import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { DipendenteGeneraleComponent } from "src/app/component/dipendente-generale/dipendente-generale.component";
import { Bonifico } from 'src/app/models/bonifico';
import { Documento } from "src/app/models/documento";
import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Dipendenti } from "src/app/models/dipendenti";
import { BonificoService } from 'src/app/service/bonifico.service';
import { FattureService } from "src/app/service/fatture.service";
import { NotaCreditoService } from "src/app/service/notacredito.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-dialog-document',
  templateUrl: './dialog-document.component.html',
  styleUrls: ['./dialog-document.component.css']
})
export class DialogDocumentComponent implements OnInit {
  @Input() disable: boolean;

  item: any; //TODO

  public dipendente: Dipendenti;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;
  public uploadingNotaCredito: boolean;
  public uploadingBonifici: boolean;
  public addingFattura: boolean;
  public addingNotaCredito: boolean;
  public addingBonifici: boolean;

  public nuovaFattura: Fatture;
  public nuovaNotacredito: NotaCredito;
  public nuovaBonifico: Bonifico;

  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public fattureDataSource: MatTableDataSource<Fatture>;
  public noteCreditoDataSource: MatTableDataSource<NotaCredito>;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  @ViewChild("paginatorFatture", {static: false})
  fatturePaginator: MatPaginator;
  @ViewChild("paginatorNoteCredito", {static: false})
  notacreditoPaginator: MatPaginator;
  @ViewChild("paginatorBonifici", {static: false})
  bonificiPaginator: MatPaginator;

  public fatture: Fatture[];
  public noteCredito: NotaCredito[];
  public bonifici: Bonifico[];


  constructor(
    public messageService: MessagesService,
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<DipendenteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { dipendente: Dipendenti; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public notacreditoService: NotaCreditoService,
    public bonficoService: BonificoService,
    public dipendenteService: DipendentiService,
    public dialog: MatDialog
  ) {
    this.uploading = false;
    this.dipendente = this.data.dipendente;
    this.newItem = this.data.newItem || false;
    this.uploadingFattura = false;
    this.addingFattura = false;
    this.addingNotaCredito = false;
    this.uploadingNotaCredito = false;
    this.uploadingBonifici = false;


    //this.dipendente = JSON.parse(JSON.stringify(this.data.dipendente));
    console.log("Dialog documento generale", this.data);
  }

  ngOnInit() {
  }


  async upload(typeDocument: string, event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();

      const nameDocument: string = file.name;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.dipendente._id}`);
      formData.append("name", nameDocument);

      this.uploading = true;

      if (this.document[typeDocument] == undefined) {
        this.document[typeDocument] = {
          uploading: true,
          error: false
        }
      }

      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          this.document[typeDocument] = {
            status: true,
            name: nameDocument,
            uploading: false,
            error: false
          };

        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
          this.document[typeDocument].uploading = false;
          this.document[typeDocument].error = true;
        });
    }
  }


  save() {
    //TODO
  }



}
