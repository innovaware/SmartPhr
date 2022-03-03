import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoDipendente } from 'src/app/models/documentoDipendente';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-generale-personale',
  templateUrl: './generale-personale.component.html',
  styleUrls: ['./generale-personale.component.css']
})
export class GeneralePersonaleComponent implements OnInit {
  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  public notenuovoDocumentoIdentita = "";


  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];


  @ViewChild("paginatorDocIdent", { static: false })
  docIdentitaPaginator: MatPaginator;
  public nuovoDocumentoIdentita: DocumentoDipendente;
  public docIdentitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsIdentita: DocumentoDipendente[];
  public uploadingDocIdentita: boolean;
  public addingDocIdentita: boolean;


  @ViewChild("paginatorDiploma", { static: false })
  diplomaPaginator: MatPaginator;
  public nuovoDiploma: DocumentoDipendente;
  public diplomiDataSource: MatTableDataSource<DocumentoDipendente>;
  public diplomi: DocumentoDipendente[];
  public uploadingDiploma: boolean;
  public addingDiploma: boolean;


  @ViewChild("paginatorAttestatiECM", { static: false })
  attestatiPaginator: MatPaginator;
  public nuovoAttestatoECM: DocumentoDipendente;
  public attestatiECMDataSource: MatTableDataSource<DocumentoDipendente>;
  public attestati: DocumentoDipendente[];
  public uploadingAttestatoECM: boolean;
  public addingAttestatoECM: boolean;


  
  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService,public dipendenteService: DipendentiService,
    public authenticationService:AuthenticationService  ) {
      this.loadUser();
    this.uploadingDocIdentita = false;
    this.addingDocIdentita = false;
   }

    ngOnInit() {
      
  }


  loadUser(){
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user)=>{
   
        console.log('get dipendente');
        this.dipendenteService
        .getByIdUser(user._id)
        .then((x) => {
          console.log('dipendente: ' + JSON.stringify(x));
              this.dipendente = x[0];
              this.getDocIdentita();
              this.getDiplomi();
              this.getAttestatiECM();
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
   
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

  // DOCUMENTI IDENTITA
  async addDocIdentita() {
    this.addingDocIdentita = true;
    this.nuovoDocumentoIdentita = {
      filename: undefined,
      note: this.notenuovoDocumentoIdentita,
      type: "DocumentoIdentita",
    };
  }

  async uploadDocIdentita($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload documento: ", $event);
      this.nuovoDocumentoIdentita.filename = file.name;
      this.nuovoDocumentoIdentita.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteDocIdentita(doc: DocumentoDipendente) {
    console.log("Cancella doc identita: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("doc identita cancellata");
        const index = this.docsIdentita.indexOf(doc);
        console.log("doc identita cancellata index: ", index);
        if (index > -1) {
          this.docsIdentita.splice(index, 1);
        }

        console.log(
          "doc identita cancellata this.fatture: ",
          this.docsIdentita
        );
        this.docIdentitaDataSource.data = this.docsIdentita;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveDocIdentita(doc: DocumentoDipendente) {
    const typeDocument = "DocumentoIdentita";
    const path = "DocumentoIdentita";
    const file: File = doc.file;
    this.uploadingDocIdentita = true;

    console.log("Invio doc identita: ", doc);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert doc identita: ", result);
        this.docsIdentita.push(result);
        this.docIdentitaDataSource.data = this.docsIdentita;
        this.addingDocIdentita = false;
        this.uploadingDocIdentita = false;

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
        this.messageService.showMessageError("Errore Inserimento documento d'identità");
        console.error(err);
      });
  }

  async getDocIdentita() {
    console.log(`get DocIdentita dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "DocumentoIdentita")
      .then((f: DocumentoDipendente[]) => {
        this.docsIdentita = f;

        this.docIdentitaDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.docsIdentita
        );
        this.docIdentitaDataSource.paginator = this.docIdentitaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista fatture");
        console.error(err);
      });
  }

  // FINE DOCUMENTI IDENTITA



    // DIPLOMA
    async addDiploma() {
      this.addingDiploma = true;
      this.nuovoDiploma = {
        filename: undefined,
        note: "",
        type: "Diploma",
      };
    }
  
    async uploadDiploma($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload Diploma: ", $event);
        this.nuovoDiploma.filename = file.name;
        this.nuovoDiploma.file = file;
      } else {
        this.messageService.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
    async deleteDiploma(doc: DocumentoDipendente) {
      console.log("Cancella Diploma: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("Diploma cancellata");
          const index = this.diplomi.indexOf(doc);
          console.log("Diploma cancellata index: ", index);
          if (index > -1) {
            this.diplomi.splice(index, 1);
          }
  
          console.log("Diploma cancellata : ", this.diplomi);
          this.diplomiDataSource.data = this.diplomi;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nella cancellazione Diploma");
          console.error(err);
        });
    }
  
    async saveDiploma(doc: DocumentoDipendente) {
      const typeDocument = "Diploma";
      const path = "Diploma";
      const file: File = doc.file;
      this.uploadingDiploma = true;
  
      console.log("Invio Diploma: ", doc);
      this.docService
        .insert(doc, this.dipendente)
        .then((result: DocumentoDipendente) => {
          console.log("Insert Diploma: ", result);
          this.diplomi.push(result);
          this.diplomiDataSource.data = this.diplomi;
          this.addingDiploma = false;
          this.uploadingDiploma = false;
  
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
          this.messageService.showMessageError("Errore Inserimento diploma");
          console.error(err);
        });
    }
  
    async getDiplomi() {
      console.log(`get Diplomi dipendente: ${this.dipendente._id}`);
      this.docService
        .get(this.dipendente, "Diploma")
        .then((f: DocumentoDipendente[]) => {
          this.diplomi = f;
  
          this.diplomiDataSource = new MatTableDataSource<DocumentoDipendente>(
            this.diplomi
          );
          this.diplomiDataSource.paginator = this.diplomaPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore caricamento lista Diplomi");
          console.error(err);
        });
    }
  
    // FINE DIPLOMA
  
    // DIPLOMA
    async addAttestatoECM() {
      this.addingAttestatoECM = true;
      this.nuovoAttestatoECM = {
        filename: undefined,
        note: "",
        type: "AttestatoECM",
      };
    }
  
    async uploadAttestatoECM($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload AttestatoECM: ", $event);
        this.nuovoAttestatoECM.filename = file.name;
        this.nuovoAttestatoECM.file = file;
      } else {
        this.messageService.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
    async deleteAttestatoECM(doc: DocumentoDipendente) {
      console.log("Cancella AttestatoECM: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("AttestatoECM cancellata");
          const index = this.attestati.indexOf(doc);
          console.log("AttestatoECM cancellata index: ", index);
          if (index > -1) {
            this.attestati.splice(index, 1);
          }
  
          console.log("AttestatoECM cancellata : ", this.attestati);
          this.attestatiECMDataSource.data = this.attestati;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nella cancellazione AttestatoECM");
          console.error(err);
        });
    }
  
    async saveAttestatoECM(doc: DocumentoDipendente) {
      const typeDocument = "AttestatoECM";
      const path = "AttestatoECM";
      const file: File = doc.file;
      this.uploadingAttestatoECM = true;
  
      console.log("Invio AttestatoECM: ", doc);
      this.docService
        .insert(doc, this.dipendente)
        .then((result: DocumentoDipendente) => {
          console.log("Insert AttestatoECM: ", result);
          this.attestati.push(result);
          this.attestatiECMDataSource.data = this.attestati;
          this.addingAttestatoECM = false;
          this.uploadingAttestatoECM = false;
  
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
          this.messageService.showMessageError("Errore Inserimento Documento");
          console.error(err);
        });
    }
  
    async getAttestatiECM() {
      console.log(`get AttestatiECM dipendente: ${this.dipendente._id}`);
      this.docService
        .get(this.dipendente, "Diploma")
        .then((f: DocumentoDipendente[]) => {
          this.attestati = f;
  
          this.attestatiECMDataSource = new MatTableDataSource<DocumentoDipendente>(
            this.attestati
          );
          this.attestatiECMDataSource.paginator = this.attestatiPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore caricamento lista attestatiECM");
          console.error(err);
        });
    }
  
    // FINE ATTESTATI ECM
}
