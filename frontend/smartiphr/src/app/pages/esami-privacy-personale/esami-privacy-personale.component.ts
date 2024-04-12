import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCaricadocumentoComponent } from 'src/app/dialogs/dialog-caricadocumento/dialog-caricadocumento.component';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoDipendente } from 'src/app/models/documentoDipendente';
import { DocumentoMedicinaLavoro } from 'src/app/models/documentoMedicinaLavoro';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-esami-privacy-personale',
  templateUrl: './esami-privacy-personale.component.html',
  styleUrls: ['./esami-privacy-personale.component.css']
})
export class EsamiPrivacyPersonaleComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;
  public uploadingRegolamento: boolean;

  @ViewChild("paginatorCertificatoMalattia", {static: false})
  certificatiMalattiaPaginator: MatPaginator;
  public nuovoCertificatoMalattia: DocumentoDipendente;
  public certificatiMalattiaDataSource: MatTableDataSource<DocumentoDipendente>;
  public certificatiMalattia: DocumentoDipendente[];
  public uploadingCertificatoMalattia: boolean;
  public addingCertificatoMalattia: boolean;

  DisplayedColumnsCertMalattia: string[] = [
    "descrizione",
    "namefile",
    "date",
    "note",
    "action",
  ];


  
  @ViewChild("paginatordocsMedicina", {static: false})
  docsMedicinaPaginator: MatPaginator;
  public nuovoDocMedicina: DocumentoMedicinaLavoro;
  public docsMedicinaDataSource: MatTableDataSource<DocumentoMedicinaLavoro>;
  public docsMedicina: DocumentoMedicinaLavoro[];
  public uploadingDocMedicina: boolean;
  public addingDocMedicina: boolean;

  DisplayedColumnsMedicinaLavoro: string[] = [
    "filenameRichiesta",
    "dateuploadRichiesta",
    "noteRichiesta",
    "filenameCertificato",
    "dateuploadCertificato",
    "noteCertificato",
    "action",
  ];


  @ViewChild("paginatorPrivacy", {static: false})
  privacyPaginator: MatPaginator;
  public nuovoPrivacy: DocumentoDipendente;
  public docsprivacyDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsprivacy: DocumentoDipendente[];
  public uploadingPrivacy: boolean;
  public addingPrivacy: boolean;

  
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  constructor( public dipendenteService: DipendentiService,  
    public messageService: MessagesService,
    public uploadService: UploadService,
    public docService: DocumentiService,
    public authenticationService:AuthenticationService,
    public dialog: MatDialog) {
      this.loadUser();
      this.uploadingRegolamento = false;
     }

  ngOnInit() {
  }


  loadUser(){
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user)=>{
        console.log('get dipendente');
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
        .then((x) => {
          console.log('dipendente: ' + JSON.stringify(x));
          this.dipendente = x[0];
              this.getCertificatoMalattia();
              this.getDocsPrivacy();
              this.getDocMedicinaLav();
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
      }); 
  }

  saveDipendente(){
    
    this.dipendenteService
            .save(this.dipendente)
            .then((x) => {
              console.log("Save dipendente: ", x);
              this.uploadingRegolamento = true;
              setInterval(() => {
                this.uploadingRegolamento = false;
              },3000)
            })
            .catch((err) => {
              this.messageService.showMessageError(
                "Errore salvataggio dipendente (" + err["status"] + ")"
              );
              this.uploadingRegolamento = false;
            });
  }



  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, this.dipendente)
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


    // PRIVACY
    async addPrivacy() {
      this.addingPrivacy = true;
      this.nuovoPrivacy = {
        filename: undefined,
        note: "",
        type: "Privacy",
      };
    }
  
    async uploadPrivacy($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload Privacy: ", $event);
        this.nuovoPrivacy.filename = file.name;
        this.nuovoPrivacy.file = file;
      } else {
        this.messageService.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
    async deletePrivacy(doc: DocumentoDipendente) {
      console.log("Cancella Privacy: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("Privacy cancellata");
          const index = this.docsprivacy.indexOf(doc);
          console.log("Privacy cancellata index: ", index);
          if (index > -1) {
            this.docsprivacy.splice(index, 1);
          }
  
          console.log("Privacy cancellata : ", this.docsprivacy);
          this.docsprivacyDataSource.data = this.docsprivacy;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nella cancellazione Privacy");
          console.error(err);
        });
    }
  
    async savePrivacy(doc: DocumentoDipendente) {
      const typeDocument = "Privacy";
      const path = "Privacy";
      const file: File = doc.file;
      this.uploadingPrivacy = true;
  
      console.log("Invio Privacy: ", doc);
      this.docService
        .insert(doc, this.dipendente)
        .then((result: DocumentoDipendente) => {
          console.log("Insert Privacy: ", result);
          this.docsprivacy.push(result);
          this.docsprivacyDataSource.data = this.docsprivacy;
          this.addingPrivacy = false;
          this.uploadingPrivacy = false;
  
          let formData: FormData = new FormData();
  
          const nameDocument: string = doc.filename;
  
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
              this.messageService.showMessageError("Errore nel caricamento file");
              console.error(err);
            });
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore Inserimento fattura");
          console.error(err);
        });
    }
  
    async getDocsPrivacy() {
      console.log(`get Privacy dipendente: ${this.dipendente._id}`);
      this.docService
        .get(this.dipendente, "Privacy")
        .then((f: DocumentoDipendente[]) => {
          this.docsprivacy = f;
  
          this.docsprivacyDataSource = new MatTableDataSource<DocumentoDipendente>(
            this.docsprivacy
          );
          this.docsprivacyDataSource.paginator = this.privacyPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore caricamento lista Privacy");
          console.error(err);
        });
    }
  
    // FINE PRIVACY


      // DOCUMENTI MEDICNA LAVORO

  async getDocMedicinaLav() {
    console.log(`get DocMedicinaLav dipendente: ${this.dipendente._id}`);
    this.docService
      .getDocMedicinaLavoro(this.dipendente)
      .then((f: DocumentoMedicinaLavoro[]) => {
        this.docsMedicina = f;

        this.docsMedicinaDataSource = new MatTableDataSource<DocumentoMedicinaLavoro>(
          this.docsMedicina
        );
        this.docsMedicinaDataSource.paginator = this.docsMedicinaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista DocMedicinaLav");
        console.error(err);
      });
  }

  /*async addDocMedicinaLav() {
    this.addingDocMedicina = true;
    this.nuovoDocMedicina = {
      filename: undefined,
      note: "",
      type: "MedicinaLavoro",
      filenameesito: "",
    };
  }

  async uploadDocMedicinaLav($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoDocMedicina.filename = file.name;
      this.nuovoDocMedicina.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocMedicinaLav(doc: DocumentoDipendente) {
    console.log("Cancella Doc Medicina Lav ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Doc Medicina Lav cancellata");
        const index = this.docsMedicina.indexOf(doc);
        console.log("Doc Medicina Lav cancellata index: ", index);
        if (index > -1) {
          this.docsMedicina.splice(index, 1);
        }

        console.log(
          "Doc Medicina Lav cancellata this.fatture: ",
          this.docsMedicina
        );
        this.docsMedicinaDataSource.data = this.docsMedicina;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione Doc Medicina Lav");
        console.error(err);
      });
  }*/

  async showDocumentRichiesta(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocMedicinaLavoro(
        doc.filenameRichiesta,
        "medicinaLavoro",
        this.dipendente
      )
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

  async showDocumentCertificato(doc: DocumentoMedicinaLavoro) {
    this.uploadService
      .downloadDocDipendente(
        doc.filenameCertificato,
        "medicinaLavoro",
        this.dipendente
      )
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

  // CERTIFICATI MALATTIA
  async addCertificatoMalattia() {
    this.addingCertificatoMalattia = true;
    this.nuovoCertificatoMalattia = {
      filename: undefined,
      note: "",
      type: "CertificatoMalattia",
      filenameesito: "",
    };
  }

  async uploadCertificatoMalattia($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoCertificatoMalattia.filename = file.name;
      this.nuovoCertificatoMalattia.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteCertificatoMalattia(doc: DocumentoDipendente) {
    console.log("Cancella Certificato Malattia: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Certificato Malattia cancellata");
        const index = this.certificatiMalattia.indexOf(doc);
        console.log("Certificato Malattia cancellata index: ", index);
        if (index > -1) {
          this.certificatiMalattia.splice(index, 1);
        }

        console.log(
          "Certificato Malattia cancellata this.fatture: ",
          this.certificatiMalattia
        );
        this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveCertificatoMalattia(doc: DocumentoDipendente) {
    const typeDocument = "CertificatoMalattia";
    const path = "CertificatoMalattia";
    const file: File = doc.file;
    this.uploadingCertificatoMalattia = true;

    console.log("Invio CertificatoMalattia: ", doc);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert CertificatoMalattia: ", result);
        this.certificatiMalattia.push(result);
        this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
        this.addingCertificatoMalattia = false;
        this.uploadingCertificatoMalattia = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.dipendente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;

            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento CertificatoMalattia");
        console.error(err);
      });
  }

  async showEsitoVMCF(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filenameesito, doc.type, this.dipendente)
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

  async getCertificatoMalattia() {
    console.log(`get CertificatoMalattia dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "CertificatoMalattia")
      .then((f: DocumentoDipendente[]) => {
        this.certificatiMalattia = f;

        this.certificatiMalattiaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.certificatiMalattia
        );
        this.certificatiMalattiaDataSource.paginator = this.certificatiMalattiaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista CERTIFICATI MALATTIA");
        console.error(err);
      });
  }

  uploadVMCF(doc: DocumentoDipendente) {
    const dialogDocCMCF = this.dialog.open(DialogCaricadocumentoComponent, {
      data: { dipendente: this.dipendente, doc: doc },
    });

    dialogDocCMCF.afterClosed().subscribe((result) => {
      console.log("result upload VMCF", result);
      if (result !== false) {
        this.docService
          .update(result)
          .then((x) => {
            const index = this.certificatiMalattia.indexOf(doc);

            this.certificatiMalattia[index] = doc;

            this.certificatiMalattiaDataSource.data = this.certificatiMalattia;
            //dialogDocCMCF.close(result);
          })
          .catch((err) => {
            if (err["status"] != undefined && err["status"] != 500)
              this.messageService.showMessageError(
                "Errore upload VMCF (" + err["status"] + ")"
              );
          });
      }
    });
  }

}
