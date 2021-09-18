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
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-paziente",
  templateUrl: "./dialog-paziente.component.html",
  styleUrls: ["./dialog-paziente.component.css"],
})
export class DialogPazienteComponent implements OnInit {
  public paziente: Paziente;
  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;
  public uploadingFattura: boolean;

  fattureDisplayedColumns: string[] = ["namefile", "date", "action"];

  public fattureDataSource: MatTableDataSource<Fatture>;
  // @ViewChild(MatPaginator, { static: false }) fatturePaginator: MatPaginator;
  @ViewChild("paginatorFatture", { static: false }) fatturePaginator: MatPaginator;
  public fatture: Fatture[];

  constructor(
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<PazienteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public pazienteService: PazienteService,
    public dialog: MatDialog
  ) {
    this.uploading = false;
    this.paziente = this.data.paziente;
    this.newItem = this.data.newItem || false;
    this.uploadingFattura = false;
    //this.paziente = JSON.parse(JSON.stringify(this.data.paziente));
    console.log("Dialog paziente generale", this.data);
  }

  async save(saveAndClose: boolean) {
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

    if (saveAndClose) {
      this.dialogRef.close(this.data.paziente);
    } else {
      this.uploading = true;

      if (this.newItem) {
        this.pazienteService
          .insert(this.data.paziente)
          .then((x) => {
            console.log("Save paziente: ", x);
            this.data.paziente = x;
            this.paziente = x;
            this.uploading = false;
            this.newItem = false;
          })
          .catch((err) => {
            this.showMessageError(
              "Errore Inserimento Paziente (" + err["status"] + ")"
            );
            this.uploading = false;
          });
      } else {
        this.pazienteService
          .save(this.data.paziente)
          .then((x) => {
            console.log("Save paziente: ", x);
            this.uploading = false;
            this.newItem = false;
          })
          .catch((err) => {
            this.showMessageError(
              "Errore salvataggio Paziente (" + err["status"] + ")"
            );
            this.uploading = false;
          });
      }
    }
  }

  async changeData($event: Paziente) {
    console.log("Change paziente info", $event);
    this.paziente = $event;
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

  async deleteFattura(fattura: Fatture) {
    console.log("Cancella fattura: ", fattura);

    this.fattureService
      .remove(fattura)
      .then((x) => {
        console.log("Fattura cancellata");
        const index = this.fatture.indexOf(fattura);
        console.log("Fattura cancellata index: ", index);
        if (index > -1) {
          this.fatture.splice(index, 1);
        }

        console.log("Fattura cancellata this.fatture: ", this.fatture);
        this.fattureDataSource.data = this.fatture;

      })
      .catch((err) => {});
  }

  async uploadFattura($event) {
    this.uploadingFattura = true;
    console.log("upload fattura: ", $event);
  }

  async addFattura() {
    let fattura: Fatture = {
      filename: "filename",
    };
    this.fattureService
      .insertFattura(fattura, this.paziente)
      .then((result: Fatture) => {
        console.log("Insert fattura: ", result);
        this.fatture.push(result);
        this.fattureDataSource.data = this.fatture;
      })
      .catch((err) => {
        this.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }

  async getNoteCredito() {}

  async getBonificiAssegniContanti() {}

  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService
      .getFiles(this.paziente._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          console.log("document:", doc);
          this.document[doc.typeDocument] = {
            status: true,
            name: doc.name,
          };
        });
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista Files");
        console.error(err);
      });
  }

  ngOnInit() {
    if (this.paziente._id != undefined) {
      this.getListFile();
      this.getFatture();
      this.getNoteCredito();
      this.getBonificiAssegniContanti();
    }
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

      this.uploading = true;
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;
          this.document[typeDocument] = {
            status: true,
            name: nameDocument,
          };
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
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
