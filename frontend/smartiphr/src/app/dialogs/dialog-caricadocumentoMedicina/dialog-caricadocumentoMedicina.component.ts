import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Dipendenti } from "src/app/models/dipendenti";
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { DocumentiService } from "src/app/service/documenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";
import { DocumentoMedicinaLavoro } from "../../models/documentoMedicinaLavoro";
@Component({
  selector: "app-dialog-caricadocumentoMedicina",
  templateUrl: "./dialog-caricadocumentoMedicina.component.html",
  styleUrls: ["./dialog-caricadocumentoMedicina.component.css"],
})
export class DialogCaricadocumentoMedicinaComponent implements OnInit {
  public dipendente: Dipendenti;
  public documento: DocumentoMedicinaLavoro;
  public note: String = "";
  constructor(
    public uploadService: UploadService,
    public messageService: MessagesService,
    public docService: DocumentiService,
    @Inject(MAT_DIALOG_DATA)
    public data: { dipendente: Dipendenti; doc: DocumentoMedicinaLavoro },
    private dialogRef: MatDialogRef<DialogCaricadocumentoMedicinaComponent>,
    public dialog: MatDialog
  ) {
    this.dipendente = data.dipendente;
    this.documento = data.doc;
  }

  ngOnInit() {
    console.log("dipendente: " + JSON.stringify(this.dipendente));
    console.log("documento: " + JSON.stringify(this.documento));
  }

  async uploadCertificato($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.documento.filenameCertificato = file.name;
      this.documento.fileCertificato = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async save() {
    if (!this.documento.fileCertificato) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "MedicinaLavoroCertificato";
    const path = "MedicinaLavoroCertificato";
    const file: File = this.documento.fileCertificato;
    this.documento.noteCertificato = this.note.valueOf();
    console.log("VMCF MedicinaLavoroCertificato: ", this.documento);
    this.docService
      .updateMed(this.documento)
      .then((result: DocumentoMedicinaLavoro) => {
        console.log("update Certificato Malattia: ", result);

        let formData: FormData = new FormData();

        const nameDocument: string = this.documento.filenameCertificato;

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
