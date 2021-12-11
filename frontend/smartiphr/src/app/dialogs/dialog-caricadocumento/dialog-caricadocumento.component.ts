import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Dipendenti } from "src/app/models/dipendenti";
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { DocumentiService } from "src/app/service/documenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";
@Component({
  selector: "app-dialog-caricadocumento",
  templateUrl: "./dialog-caricadocumento.component.html",
  styleUrls: ["./dialog-caricadocumento.component.css"],
})
export class DialogCaricadocumentoComponent implements OnInit {
  public dipendente: Dipendenti;
  public documento: DocumentoDipendente;
  constructor(
    public uploadService: UploadService,
    public messageService: MessagesService,
    public docService: DocumentiService,
    @Inject(MAT_DIALOG_DATA)
    public data: { dipendente: Dipendenti; doc: DocumentoDipendente },
    private dialogRef: MatDialogRef<DialogCaricadocumentoComponent>,
    public dialog: MatDialog
  ) {
    this.dipendente = data.dipendente;
    this.documento = data.doc;
  }

  ngOnInit() {
    console.log("dipendente: " + JSON.stringify(this.dipendente));
    console.log("documento: " + JSON.stringify(this.documento));
  }

  async uploadVMCF($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.documento.filenameesito = file.name;
      this.documento.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async save() {
    const typeDocument = "CertificatoMalattia";
    const path = "CertificatoMalattia";
    const file: File = this.documento.file;

    console.log("VMCF CertificatoMalattia: ", this.documento);
    this.docService
      .update(this.documento)
      .then((result: DocumentoDipendente) => {
        console.log("update VMCF Certificato Malattia: ", result);

        let formData: FormData = new FormData();

        const nameDocument: string = this.documento.filenameesito;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.dipendente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            console.log("Uploading completed: ", x);
            this.dialogRef.close();
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
  }
}
