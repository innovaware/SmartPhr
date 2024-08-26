import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { DocumentoDipendente } from "src/app/models/documentoDipendente";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { DocumentiService } from "src/app/service/documenti.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";
import { UsersService } from "src/app/service/users.service";
import { MansioniService } from "../../service/mansioni.service";
import { Mansione } from "../../models/mansione";

@Component({
  selector: "app-generale-personale",
  templateUrl: "./generale-personale.component.html",
  styleUrls: ["./generale-personale.component.css"],
})
export class GeneralePersonaleComponent implements OnInit {
  public uploading: boolean;
  public uploadingCred: boolean;
  public errorCred: boolean;
  disable: boolean = true;
  dipendente: Dipendenti;
  utente: User;

  public notenuovoDocumentoIdentita = "";

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  DisplayedColumnsFile: string[] = ["namefile", "date","type", "note", "action"];

  @ViewChild("paginatorDocIdent", {static: false})
  docIdentitaPaginator: MatPaginator;
  public nuovoDocumentoIdentita: DocumentoDipendente;
  public docIdentitaDataSource: MatTableDataSource<DocumentoDipendente>;
  public docsIdentita: DocumentoDipendente[];
  public uploadingDocIdentita: boolean;
  public addingDocIdentita: boolean;

  @ViewChild("paginatorDiploma", {static: false})
  diplomaPaginator: MatPaginator;
  public nuovoDiploma: DocumentoDipendente;
  public diplomiDataSource: MatTableDataSource<DocumentoDipendente>;
  public diplomi: DocumentoDipendente[];
  public uploadingDiploma: boolean;
  public addingDiploma: boolean;
  public mansione: string = "";
  @ViewChild("paginatorAttestatiECM", {static: false})
  attestatiPaginator: MatPaginator;
  public nuovoAttestatoECM: DocumentoDipendente;
  public attestatiECMDataSource: MatTableDataSource<DocumentoDipendente>;
  public attestati: DocumentoDipendente[];
  public uploadingAttestatoECM: boolean;
  public addingAttestatoECM: boolean;
  public admin: Boolean = false;
  confirmpassword: String;

  constructor(
    public messageService: MessagesService,
    public docService: DocumentiService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public usersService: UsersService,
    public mansioniService: MansioniService
  ) {
    this.dipendente = new Dipendenti();
    this.utente = new User();
    this.loadUser();
    this.uploadingDocIdentita = false;
    this.addingDocIdentita = false;
    this.uploading = false;
    this.uploadingCred = false;
    this.errorCred = false;
    this.mansioniService.get().then((result) => {
      result.forEach((x: Mansione) => {
        if (x._id == this.dipendente.mansione) {
          this.mansione = x.descrizione;
          return;
        }
      });
    });
  }


  ngOnInit() {
    this.loadUser();
}

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user.dipendenteID)
        .then((x) => {
          this.dipendente = x[0];
          console.log("loadUserCred: " + user._id);
          this.loadUserCred(user._id);
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

  loadUserCred(user_id) {
    console.log("get cred user");
    this.usersService
      .getById(user_id)
      .then((x) => {
        console.log("utente: " + JSON.stringify(x));
        this.utente = x;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore Caricamento dipendente (" + err["status"] + ")"
        );
      });
  }

  saveDipendente(dipendente: Dipendenti) {
    this.dipendenteService
      .save(this.dipendente)
      .then((x) => {
        console.log("Save dipendente: ", x);
        this.uploading = true;
        setInterval(() => {
          this.uploading = false;
        }, 3000);
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore salvataggio dipendente (" + err["status"] + ")"
        );
        this.uploading = false;
      });
  }

  saveCred() {
    if (this.confirmpassword == this.utente.password) {
      this.usersService
        .save(this.utente)
        .then((x) => {
          this.errorCred = false;
          console.log("Save utente: ", x);
          this.uploadingCred = true;
          setInterval(() => {
            this.uploadingCred = false;
          }, 3000);
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore salvataggio utente (" + err["status"] + ")"
          );
          this.uploadingCred = false;
        });
    } else this.errorCred = true;
  }

  async showDocument(doc: DocumentoDipendente) {
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, this.dipendente)
      .then((x) => {
        
        x.subscribe((data) => {
          
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          const nav = (window.navigator as any);
          if (nav.msSaveOrOpenBlob) {
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
        this.messageService.showMessageError(
          "Errore nella cancellazione doc identita"
        );
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
        this.messageService.showMessageError(
          "Errore Inserimento documento d'identità"
        );
        console.error(err);
      });
  }

  async getDocIdentita() {
    console.log(`get DocIdentita dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "DocumentoIdentita")
      .then((f: DocumentoDipendente[]) => {
        this.docsIdentita = f;

        this.docIdentitaDataSource =
          new MatTableDataSource<DocumentoDipendente>(this.docsIdentita);
        this.docIdentitaDataSource.paginator = this.docIdentitaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista fatture"
        );
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
        this.messageService.showMessageError(
          "Errore nella cancellazione Diploma"
        );
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

    try {
      const [diplomi, testFinali] = await Promise.all([
        this.docService.get(this.dipendente, "Diploma"),
        this.docService.get(this.dipendente, "areaFormazione")
      ]);

      // Combine all documents into one array
      const file = [...diplomi, ...testFinali];

      // Assign combined documents to diplomi
      this.diplomi = file;

      // Set up data source for table
      this.diplomiDataSource = new MatTableDataSource<DocumentoDipendente>(this.diplomi);
      this.diplomiDataSource.paginator = this.diplomaPaginator;
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento lista Diplomi");
      console.error(err);
    }
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
        this.messageService.showMessageError(
          "Errore nella cancellazione AttestatoECM"
        );
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

        this.attestatiECMDataSource =
          new MatTableDataSource<DocumentoDipendente>(this.attestati);
        this.attestatiECMDataSource.paginator = this.attestatiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista attestatiECM"
        );
        console.error(err);
      });
  }

  // FINE ATTESTATI ECM
}
