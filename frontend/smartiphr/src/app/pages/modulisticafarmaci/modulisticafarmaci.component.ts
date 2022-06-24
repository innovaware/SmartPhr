import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { DialogFarmaciPazienteComponent } from 'src/app/dialogs/dialog-farmaci-paziente/dialog-farmaci-paziente.component';
import { DialogModulisticaPazienteComponent } from 'src/app/dialogs/dialog-modulistica-paziente/dialog-modulistica-paziente.component';
import { dataIngresso } from 'src/app/models/dataIngresso';
import { DinamicButton } from 'src/app/models/dinamicButton';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoFarmaci } from 'src/app/models/documentoFarmaci';
import { Paziente } from 'src/app/models/paziente';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentifarmaciService } from 'src/app/service/documentifarmaci.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-modulisticafarmaci',
  templateUrl: './modulisticafarmaci.component.html',
  styleUrls: ['./modulisticafarmaci.component.css']
})
export class ModulisticafarmaciComponent implements OnInit {

  @ViewChild("paginatorDocumenti",{static: false})
  DocumentiPaginator: MatPaginator;
  public nuovoDocumento: DocumentoFarmaci;
  public DocumentiDataSource: MatTableDataSource<DocumentoFarmaci>;
  public documenti: DocumentoFarmaci[] = [];
  public uploadingDocumento: boolean;
  public addingDocumento: boolean;

  pazienti: Paziente[];
  customButtons: DinamicButton[];
  eventsSubject: Subject<Paziente[]> = new Subject<Paziente[]>();

  
  paziente: Paziente;
  ingresso: dataIngresso;
  dipendente: Dipendenti = {} as Dipendenti;
  utente: User = {} as User;
  
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

   constructor(//public dialogRef: MatDialogRef<DialogIngressoComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentifarmaciService,
    public dataIngressoService: DataIngressoService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
   ){

    }

    ngOnInit() {
      this.getDocumenti();
      this.loadUser();

      this.customButtons = [];
    console.log("Init Area Medica");

    this.customButtons.push({
      images: "",
      label: "Modulistica",
      tooltip: "Modulistica",
      cmd: (paziente: Paziente) =>
        this.dialog.open(DialogModulisticaPazienteComponent, {
            data: { paziente: paziente, readonly: false, altro: false },
            width: "800px",
          })
          .afterClosed()
          .subscribe((data: Paziente) => {
             if (data != undefined || data) {
            //   this.pazienti.push(data);

            //   const index = this.pazienti.indexOf(paziente, 0);
            //   if (index > -1) {
            //     this.pazienti.splice(index, 1);
            //     console.log("Removed item");
            //   }
            //   this.eventsSubject.next(this.pazienti);
            console.log("Area Modulistica Farmaci Update Paziente");
            Paziente.refresh(data, paziente);
            }
          }),
      //css: "mat-raised-button raised-button action-button",
    });

    this.pazienteService.getPazienti().then((paz: Paziente[]) => {
      this.pazienti = paz;

      this.eventsSubject.next(this.pazienti);
    });
    }

    loadUser() {
      this.authenticationService.getCurrentUserAsync().subscribe((user) => {
        console.log("get dipendente");
        this.dipendenteService
          .getByIdUser(user._id)
          .then((x) => {
            console.log("dipendente: " + JSON.stringify(x[0]));
            this.dipendente = x[0];
  
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
    }



    async showDocument(documento: DocumentoFarmaci) {
      this.uploadService
        .download(documento.filename, "", "")
        .then((x) => {
          console.log("download: ", x);
          x.subscribe((data) => {
            console.log("download: ", data);
            const newBlob = new Blob([data as BlobPart], {
              type: "application/pdf",
            });
  
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            const nav = window.navigator as any;
            if (window.navigator && nav.msSaveOrOpenBlob) {
              nav.msSaveOrOpenBlob(newBlob);
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

  // DOCUMENTI FARMACI GENERICA
  async addDocumento() {
    this.addingDocumento = true;
    this.nuovoDocumento = {
      operator_id: this.dipendente != undefined ? this.dipendente._id : "",
      operator: this.dipendente != undefined ? this.dipendente.nome + ' ' + this.dipendente.cognome : "",
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

  async deleteDocumento(doc: DocumentoFarmaci) {
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
        this.DocumentiDataSource.data = this.documenti;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione doc"
        );
        console.error(err);
      });
  }

  async saveDocumento(doc: DocumentoFarmaci) {
    const typeDocument = doc.type;
    const path = doc.type;
    const file: File = doc.file;
    this.uploadingDocumento = true;

    doc.type = "";

    console.log("Invio Documento: ", doc);

    // doc.type = this.nuovoDocumento.typeDocument;
    // doc.typeDocument = "ingresso";

    this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoFarmaci) => {
        console.log("Insert Documento: ", result);
        this.documenti.push(result);
        this.DocumentiDataSource.data = this.documenti;
        this.addingDocumento = false;
        this.uploadingDocumento = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
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
    console.log(`get Documenti`);
    this.docService
      .get()
      .then((f: DocumentoFarmaci[]) => {
        this.documenti = f;
        console.log('documenti: ' + JSON.stringify(f));
        this.DocumentiDataSource = new MatTableDataSource<DocumentoFarmaci>(
          this.documenti
        );
        this.DocumentiDataSource.paginator = this.DocumentiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Documento"
        );
        console.error(err);
      });
  }


  

}
