import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PazienteGeneraleComponent } from "src/app/component/paziente-generale/paziente-generale.component";
import { Bonifico } from 'src/app/models/bonifico';
import { Documento } from "src/app/models/documento";
import { Fatture } from "src/app/models/fatture";
import { NotaCredito } from "src/app/models/notacredito";
import { Paziente } from "src/app/models/paziente";
import { BonificoService } from 'src/app/service/bonifico.service';
import { DocumentipazientiService } from "src/app/service/documentipazienti.service";
import { FattureService } from "src/app/service/fatture.service";
import { MessagesService } from 'src/app/service/messages.service';
import { NotaCreditoService } from "src/app/service/notacredito.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";
import { ICF } from "../../models/ICF";
import { DocumentoPaziente } from "../../models/documentoPaziente";

@Component({
  selector: 'app-dialog-pai',
  templateUrl: './dialog-pai.component.html',
  styleUrls: ['./dialog-pai.component.css']
})
export class DialogPaiComponent implements OnInit {
  public paziente: Paziente;
  public document: any[] = [];
  public uploading: boolean;

  @ViewChild("paginatorSchedaFIM", { static: false })
  SchedaFIMPaginator: MatPaginator;
  public nuovoSchedaFIM: DocumentoPaziente;
  public SchedaFIMDataSource: MatTableDataSource<DocumentoPaziente>;
  public SchedaFIM: DocumentoPaziente[];
  public uploadingSchedaFIM: boolean;
  public addingSchedaFIM: boolean;

  DisplayedColumns: string[] = ["namefile", "date", "note","action"];
  constructor(
    public uploadService: UploadService,
    public docService: DocumentipazientiService,
    public dialogRef: MatDialogRef<PazienteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean },
    public fattureService: FattureService,
    public notacreditoService: NotaCreditoService,
    public bonficoService: BonificoService,
    public pazienteService: PazienteService,
    public messageService: MessagesService,
    public dialog: MatDialog
  ) {
    this.paziente = this.data.paziente;
    console.log("Dialog paziente PAI", this.data);
    if (this.paziente.schedaAssSociale.ICF == undefined || this.paziente.schedaAssSociale.ICF == null)
      this.paziente.schedaAssSociale.ICF = new ICF();

    this.nuovoSchedaFIM = new DocumentoPaziente();
    this.SchedaFIMDataSource = new MatTableDataSource<DocumentoPaziente>();
    this.SchedaFIM = [];
    this.getSchedaFIM();
  }

  ngOnInit() {
    //this.getListFile();
  }

  async showDocument(doc: DocumentoPaziente) {
    console.log("doc: ", JSON.stringify(doc));
    this.uploadService
      .downloadDocPaziente(doc.filename, doc.type, this.paziente._id)
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


  showDocumentGeneric(document: any) {
    console.log("ShowDocument: ", document);
    this.uploadService
      .download(document.name, this.paziente._id, '')
      .then((x) => {
        //
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

  removeDocument(documentRemoving: any) {
    console.log("document to remove: ", documentRemoving);
    this.uploadService.removeFile(documentRemoving.id).subscribe(result=> {
      console.log("document Removed: ", result);
      documentRemoving.status=false;
    });
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

      if (this.document[typeDocument] == undefined) {
        this.document[typeDocument] = {
          uploading: true,
          error: false
        }
      }

      this.uploadService
        .uploadDocument(formData)
        .then((x: any) => {
          this.uploading = false;

          this.document[typeDocument] = {
            id: x.result.id,
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
/*
  async showDocument(doc: DocumentoPaziente) {
    console.log("doc: ", JSON.stringify(doc));
    this.uploadService
    .download(doc.filename, doc._id, doc.type)
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


  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService
      .getFiles(this.paziente._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          // console.log("document:", doc);
          this.document[doc.typeDocument] = {
            status: true,
            name: doc.name,
            dateupload: doc.dateupload,
          };
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Files");
        console.error(err);
      });
  }*/

  async Salva() {
    this.pazienteService.save(this.paziente).then((value: Paziente) => {
      console.log(`Patient  saved`, value);
      //this.dialogRef.close(this.paziente);
    });
  }


  async getSchedaFIM() {
    console.log(`get DocsSchedaFIM paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, "SchedaFIM")
      .then((f: DocumentoPaziente[]) => {
        this.SchedaFIM = f;

        this.SchedaFIMDataSource = new MatTableDataSource<DocumentoPaziente>(
          this.SchedaFIM
        );
        this.SchedaFIMDataSource.paginator = this.SchedaFIMPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista DocsSchedaFIM"
        );
        console.error(err);
      });
  }
}
