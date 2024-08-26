import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Dipendenti } from "src/app/models/dipendenti";
import { Ferie } from "src/app/models/ferie";
import { FerieService } from "src/app/service/ferie.service";
import { MessagesService } from "src/app/service/messages.service";
import { DocumentoDipendente } from "../../models/documentoDipendente";
import { DocumentiService } from "../../service/documenti.service";
import { DipendentiService } from "../../service/dipendenti.service";
import { UploadService } from "../../service/upload.service";
import { AuthenticationService } from "../../service/authentication.service";
import { MansioniService } from "../../service/mansioni.service";

@Component({
  selector: "app-upload-doc",
  templateUrl: "./upload-doc.component.html",
  styleUrls: ["./upload-doc.component.css"],
})
export class UploadDocComponent implements OnInit, OnChanges {
  @Input() dipendente: Dipendenti;
  @Input() tipo: String;
  
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
  ) //public dipendenteService: DipendentiService
  {
    this.uploadingverificheInt = false;
    this.addingverificheInt = false;
    this.nuovoverificheInt = new DocumentoDipendente();
    this.verificheInt = [];
    this.verificheIntDataSource = new MatTableDataSource<DocumentoDipendente>();

    this.getVerificheInt();
  }

  ngOnChanges(changes) {
    this.getVerificheInt();
  }

  ngOnInit() {

    this.getVerificheInt();
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

  async addverificheInt() {
    this.addingverificheInt = true;
    this.nuovoverificheInt = {
      filename: undefined,
      note: "",
      type: this.tipo.valueOf(),
    };
  }

  async uploadverificheInt($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      this.nuovoverificheInt.filename = file.name;
      this.nuovoverificheInt.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteverificheInt(doc: DocumentoDipendente) {

    this.docService
      .remove(doc)
      .then((x) => {
        const index = this.verificheInt.indexOf(doc);
        if (index > -1) {
          this.verificheInt.splice(index, 1);
        }

        this.verificheIntDataSource.data = this.verificheInt;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveverificheInt(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    } 
    const typeDocument = this.tipo.valueOf();
    const path = this.tipo.valueOf();
    const file: File = doc.file;
    this.uploadingverificheInt = true;

    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        this.verificheInt.push(result);
        this.verificheIntDataSource.data = this.verificheInt.sort((a, b) => {
          return new Date(b.dateupload).getTime() - new Date(a.dateupload).getTime();
        });
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
    if (this.tipo == "RegolamentoInterno") {
      this.dipendenteService.get().then((res) => {
        res.forEach((x: Dipendenti) => {
          x.accettatoRegolamento = false;
          this.dipendenteService.save(x);
        });
      });
    }
  }

  async getVerificheInt() {
    this.docService
      .getByType(this.tipo.valueOf())
      .then((f: DocumentoDipendente[]) => {
        this.verificheInt = f.sort((a, b) => {
          return new Date(b.dateupload).getTime() - new Date(a.dateupload).getTime();
        });

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

}
