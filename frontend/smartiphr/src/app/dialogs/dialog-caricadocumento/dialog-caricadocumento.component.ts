import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Dipendenti } from "src/app/models/dipendenti";
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { DocumentiService } from "src/app/service/documenti.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
@Component({
  selector: 'app-dialog-caricadocumento',
  templateUrl: './dialog-caricadocumento.component.html',
  styleUrls: ['./dialog-caricadocumento.component.css']
})
export class DialogCaricadocumentoComponent implements OnInit {

  public dipendente: Dipendenti;
  public documento: DocumentoDipendente;
  constructor( public uploadService: UploadService,public docService: DocumentiService, 
    @Inject(MAT_DIALOG_DATA) public data: { dipendente: Dipendenti; doc: DocumentoDipendente},
              public dialog: MatDialog) { 
                    this.dipendente = data.dipendente;
                    this.documento = data.doc;
              }

  ngOnInit() {
    console.log('dipendente: ' + JSON.stringify(this.dipendente))
    console.log('documento: ' + JSON.stringify(this.documento))
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



  async uploadVMCF($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.documento.filenameesito = file.name;
      this.documento.file = file;

    } else {
      this.showMessageError("File non valido");
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
      console.log("update doc identita: ", result);
    
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
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }

}
