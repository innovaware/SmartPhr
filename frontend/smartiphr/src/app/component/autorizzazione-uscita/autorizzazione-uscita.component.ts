import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { DocumentoAutorizzazioneUscita } from "src/app/models/documentoAutorizzazioneUscita";
import { DocumentiService } from "src/app/service/documenti.service";
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from "src/app/service/upload.service";

@Component({
  selector: "app-autorizzazione-uscita",
  templateUrl: "./autorizzazione-uscita.component.html",
  styleUrls: ["./autorizzazione-uscita.component.css"],
})
export class AutorizzazioneUscitaComponent implements OnInit {
  @Input() id: string;

  addingDocument: boolean = false;
  uploadingDocumento: boolean = false;
  nuovoDocumento: DocumentoAutorizzazioneUscita;
  documento: DocumentoAutorizzazioneUscita;

  constructor(
    public dialog: MatDialog,
    public docService: PazienteService,
    public uploadService: UploadService
  ) {}

  ngOnInit() {
    this.loadDocumento();
  }

  AddDocument() {
    this.addingDocument = true;
    this.nuovoDocumento = new DocumentoAutorizzazioneUscita();
    this.documento = undefined;
  }

  async uploadDocumento($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoDocumento.filename = file.name;
      this.nuovoDocumento.file = file;
    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveDocumento(doc: DocumentoAutorizzazioneUscita) {
    const typeDocument = "Documeno Autorizzazione Uscita";
    const path = "DocumentoAutorizzazioneUscita";
    const file: File = doc.file;
    this.uploadingDocumento = true;

    console.log("Invio documento: ", doc);
    this.docService
      .insertAutorizzazioneUscita(this.id, doc)
      .subscribe(
        (result: DocumentoAutorizzazioneUscita) => {
          console.log("Insert doc identita: ", result);

          let formData: FormData = new FormData();

          const nameDocument: string = doc.filename;

          formData.append("file", file);
          formData.append("typeDocument", typeDocument);
          formData.append("path", `${this.id}/${path}`);
          formData.append("name", nameDocument);

          this.uploadService
            .uploadDocument(formData)
            .then((x) => {
              this.addingDocument = false;
              this.uploadingDocumento = false;

              this.documento = result;
              console.log("Uploading completed: ", x);
            })
            .catch((err) => {
              this.showMessageError("Errore nel caricamento file");
              console.error(err);
              this.addingDocument = false;
              this.uploadingDocumento = false;
            });
        },
        (err) => {
          this.showMessageError("Errore Inserimento documento");
          console.error(err);
        });
  }

  async loadDocumento() {
    this.docService
    .getAutorizzazioneUscita(this.id)
    .subscribe(
      (result: DocumentoAutorizzazioneUscita) => {
        console.log("Loaded document: ", result);
        this.documento = result;
      },
      (err) => {
        console.log("Error load autorizzazione uscita");
        this.showMessageError("Errore nel caricamento Documento di Autorizzazione Uscita");
      }
    );
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
