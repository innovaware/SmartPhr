import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSelectModule, MAT_DIALOG_DATA } from '@angular/material';
import { dataIngresso } from 'src/app/models/dataIngresso';
import { DocumentoPaziente } from 'src/app/models/documentoPaziente';
import { Paziente } from 'src/app/models/paziente';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { DocumentipazientiService } from 'src/app/service/documentipazienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
@Component({
  selector: 'app-dialog-ingresso',
  templateUrl: './dialog-ingresso.component.html',
  styleUrls: ['./dialog-ingresso.component.css']
})
export class DialogIngressoComponent implements OnInit {

  @ViewChild("paginatorDocument", { static: false })
  DocumentoPaginator: MatPaginator;
  public nuovoDocumento: DocumentoPaziente;
  public DocumentDataSource: MatTableDataSource<DocumentoPaziente>;
  public documenti: DocumentoPaziente[] = [];
  public uploadingDocumento: boolean;
  public addingDocumento: boolean;

  paziente: Paziente;
  ingresso: dataIngresso = {};
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

   constructor(public dialogRef: MatDialogRef<DialogIngressoComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public dataIngressoService: DataIngressoService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) { 
      this.paziente = Paziente.clone(data.paziente);
    }

 

  ngOnInit() {
    this.getDocumenti();
    this.getIngresso();
  }


  async showDocument(documento: DocumentoPaziente) {
    this.uploadService
      .download(documento.filename, documento._id, documento.typeDocument)
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


    // DOCUMENTI
    async addDocumento() {
      this.addingDocumento = true;
      this.nuovoDocumento = {
        paziente: this.paziente._id,
        filename: undefined,
        note: "",
        type: "",
      };
    }
  
    async uploadDocumento($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload Documento: ", $event);
        this.nuovoDocumento.filename = file.name;
        this.nuovoDocumento.file = file;
      } else {
        this.messageService.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
    async deleteDocumento(doc: DocumentoPaziente) {
      console.log("Cancella Documento: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("Documento cancellata");
          const index = this.documenti.indexOf(doc);
          console.log("Documento cancellata index: ", index);
          if (index > -1) {
            this.documenti.splice(index, 1);
          }
  
          console.log(
            "Documento cancellato: ",
            this.documenti
          );
          this.DocumentDataSource.data = this.documenti;
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore nella cancellazione doc identita"
          );
          console.error(err);
        });
    }
  
    async saveDocumento(doc: DocumentoPaziente) {
      const typeDocument = doc.typeDocument;
      const path = doc.typeDocument;
      const file: File = doc.file;
      this.uploadingDocumento = true;
  
      console.log("Invio Documento: ", doc);
      doc.type = this.nuovoDocumento.typeDocument;
      doc.typeDocument = "ingresso";
      this.docService
        .insert(doc, this.paziente)
        .then((result: DocumentoPaziente) => {
          console.log("Insert Documento: ", result);
          this.documenti.push(result);
          this.DocumentDataSource.data = this.documenti;
          this.addingDocumento = false;
          this.uploadingDocumento = false;
  
          let formData: FormData = new FormData();
  
          const nameDocument: string = doc.filename;
  
          formData.append("file", file);
          formData.append("typeDocument", typeDocument);
          formData.append("path", `${this.paziente._id}/${path}`);
          formData.append("name", nameDocument);
          this.uploadService
            .uploadDocument(formData)
            .then((x) => {
              this.uploadingDocumento = false;
  
              console.log("Uploading completed: ", x);
            })
            .catch((err) => {
              this.messageService.showMessageError("Errore nel caricamento file");
              console.error(err);
              this.uploadingDocumento = false;
            });
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore Inserimento documento");
          console.error(err);
        });
    }
  
    async getDocumenti() {
      console.log(`get Documento paziente: ${this.paziente._id}`);
      this.docService
        .getByIngresso(this.paziente, "Documenti")
        .then((f: DocumentoPaziente[]) => {
          this.documenti = f;
  
          this.DocumentDataSource = new MatTableDataSource<DocumentoPaziente>(
            this.documenti
          );
          this.DocumentDataSource.paginator = this.DocumentoPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore caricamento lista Documento"
          );
          console.error(err);
        });
    }


    //INGRESSO

    async getIngresso(){
      this.dataIngressoService.getIngressoByPaziente(this.paziente._id).then((result) => {
        this.ingresso = result;
      });
    }


    async saveIngresso() {
      console.log("Invio saveIngresso: ", this.ingresso);
      this.dataIngressoService
          .insertIngresso(this.ingresso)
          .then((result: dataIngresso) => {
          console.log("Insert dataIngresso: ", result);

        })
        .catch((err) => {
          this.messageService.showMessageError("Errore Inserimento dataIngresso");
          console.error(err);
        });
    }


    async updateIngresso() {
      console.log("Invio updateIngresso: ", this.ingresso);
      this.dataIngressoService
          .updateIngresso(this.ingresso)
          .then((result: dataIngresso) => {
          console.log("update dataIngresso: ", result);

        })
        .catch((err) => {
          this.messageService.showMessageError("Errore Nodifica dataIngresso");
          console.error(err);
        });
    }


}