import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { PazienteGeneraleComponent } from "src/app/component/paziente-generale/paziente-generale.component";
import { Documento } from "src/app/models/documento";
import { Fatture } from "src/app/models/fatture";
import { Paziente } from "src/app/models/paziente";
import { FattureService } from "src/app/service/fatture.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-paziente",
  templateUrl: "./dialog-paziente.component.html",
  styleUrls: ["./dialog-paziente.component.css"],
})
export class DialogPazienteComponent implements OnInit {
  public paziente: Paziente;
  public document: any[] = [];

  fattureDisplayedColumns: string[] = [
    "cognome",
    "nome",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];

  public fattureDataSource: MatTableDataSource<Fatture>;
  @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  public fatture: Fatture[];

  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<PazienteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean },
    public fattureService: FattureService,
    public dialog: MatDialog
  ) {
    this.paziente = JSON.parse(JSON.stringify(this.data.paziente));
    console.log("Dialog paziente generale", this.data);
  }

  async save() {
    // this.data.paziente = this.paziente;
    console.log("update paziente");
    this.data.paziente.cognome = this.paziente.cognome;
    this.data.paziente.nome = this.paziente.nome;
    this.data.paziente.sesso = this.paziente.sesso;
    this.data.paziente.luogoNascita = this.paziente.luogoNascita;
    this.data.paziente.dataNascita = this.paziente.dataNascita;
    this.data.paziente.residenza = this.paziente.residenza;
    this.data.paziente.statoCivile = this.paziente.statoCivile;
    this.data.paziente.figli = this.paziente.figli;
    this.data.paziente.scolarita = this.paziente.scolarita;
    this.data.paziente.situazioneLavorativa = this.paziente.situazioneLavorativa;
    this.data.paziente.personeRiferimento = this.paziente.personeRiferimento;
    this.data.paziente.telefono = this.paziente.telefono;
    this.data.paziente.dataIngresso = this.paziente.dataIngresso;
    this.data.paziente.provincia = this.paziente.provincia;
    this.data.paziente.localita = this.paziente.localita;
    this.data.paziente.provenienza = this.paziente.provenienza;
    this.data.paziente.comuneNascita = this.paziente.comuneNascita;
    this.data.paziente.provinciaNascita = this.paziente.provinciaNascita;

    this.dialogRef.close(this.data.paziente);
  }

  async getFatture() {
    console.log(`Get Fatture paziente: ${this.paziente._id}`);
    this.fattureService
      .getFatture(this.paziente)
      .then((f: Fatture[]) => {
        this.fatture = f;

        this.fattureDataSource = new MatTableDataSource<Fatture>(this.fatture);
        this.fattureDataSource.paginator = this.fatturePaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }

  async getNoteCredito() {}

  async getBonificiAssegniContanti() {}

  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService.getFiles(this.paziente._id)
      .then( (documents: Documento[]) => {

          documents.forEach((doc: Documento) => {
            (documents: Documento[]) => {
              this.document[doc.typeDocument] = {
                status: true,
                name: doc.name,
              }
            }
          });
        })
      .catch(err=> {
        this.showMessageError("Errore caricamento lista Files");
        console.error(err);
      })
  }

  ngOnInit() {
    this.getListFile();
    this.getFatture();
    this.getNoteCredito();
    this.getBonificiAssegniContanti();
  }

  async upload(typeDocument: string, event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();

      const nameDocument: string = file.name;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}`);
      formData.append("name", nameDocument);

      this.uploadService.uploadDocument(formData).then((x) => {
        this.document[typeDocument] = {
          status: true,
          name: nameDocument,
        };
      }).catch(err=> {
        this.showMessageError("Errore nel caricamento file");
        console.error(err);
      });
    }
  }

  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
  }
}
