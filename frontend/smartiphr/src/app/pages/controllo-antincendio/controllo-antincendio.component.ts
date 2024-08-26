import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from '../../service/upload.service';
import { MansioniService } from '../../service/mansioni.service';
import { DocumentiService } from '../../service/documenti.service';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentoDipendente } from '../../models/documentoDipendente';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-controllo-antincendio',
  templateUrl: './controllo-antincendio.component.html',
  styleUrls: ['./controllo-antincendio.component.css']
})


export class ControlloAntincendioComponent implements OnInit {

  public dipendente: Dipendenti;
  
  public tipo: string;
  public verificheExt: string;
  public certOmolog: string;
  public certPrev: string;
  public uploading: boolean;
  public inputSearchField;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  public admin: Boolean;
  @ViewChild("paginatorverificheInt", { static: false })
  verificheIntPaginator: MatPaginator;
  public nuovoverificheInt: DocumentoDipendente;
  public verificheIntDataSource: MatTableDataSource<DocumentoDipendente>;
  public verificheInt: DocumentoDipendente[];
  public uploadingverificheInt: boolean;
  public addingverificheInt: boolean;
  constructor(
    public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService
  ) {
    this.dipendente = new Dipendenti();
    this.tipo = "controlli";
    this.verificheExt = "VerificheEsterne";
    this.certOmolog = "CertificatoMateriali";
    this.certPrev = "CertificatoAntincendio";
    this.loadUser();
    this.uploadingverificheInt = false;
    this.addingverificheInt = false;
    this.nuovoverificheInt = new DocumentoDipendente();
    this.verificheInt = [];
    this.verificheIntDataSource = new MatTableDataSource<DocumentoDipendente>();
  }

  ngOnInit() {
  
  }
  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            
            this.dipendente = x[0];
            this.getVerificheInt();
          
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
      .downloadDocQuality(doc.filename, doc.type)
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
  ///Verifiche interne Mensili
  async addverificheInt() {
    this.addingverificheInt = true;
    this.nuovoverificheInt = {
      filename: undefined,
      note: "",
      type: "verificheInt",
    };
  }

  async uploadverificheInt($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload verificheInt: ", $event);
      this.nuovoverificheInt.filename = file.name;
      this.nuovoverificheInt.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteverificheInt(doc: DocumentoDipendente) {
    console.log("Cancella verificheInt: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("verificheInt cancellata");
        const index = this.verificheInt.indexOf(doc);
        console.log("verificheInt cancellata index: ", index);
        if (index > -1) {
          this.verificheInt.splice(index, 1);
        }

        console.log("verificheInt cancellata this.fatture: ", this.verificheInt);
        this.verificheIntDataSource.data = this.verificheInt;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveverificheInt(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "verificheInt";
    const path = "verificheInt";
    const file: File = doc.file;
    this.uploadingverificheInt = true;

    console.log("Invio verificheInt: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert verificheInt: ", result);
        this.verificheInt.push(result);
        this.verificheIntDataSource.data = this.verificheInt;
        this.addingverificheInt = false;
        this.uploadingverificheInt = false;

        let formData: FormData = new FormData();

        const nameDocument: string = doc.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
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
        this.messageService.showMessageError("Errore Inserimento verificheInt");
        console.error(err);
      });
  }

  async getVerificheInt() {
    console.log(`get verificheInt dipendente: ${this.dipendente._id}`);
    this.docService
      .getByType("verificheInt")
      .then((f: DocumentoDipendente[]) => {
        this.verificheInt = f;

        this.verificheIntDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.verificheInt
        );
        this.verificheIntDataSource.paginator = this.verificheIntPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista verificheInt");
        console.error(err);
      });
  }

  cleanSearchField() {
    this.verificheIntDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.verificheIntDataSource.filter = filterValue.trim().toLowerCase();
  }

  ///FINE: Verifiche interne Mensili
}
