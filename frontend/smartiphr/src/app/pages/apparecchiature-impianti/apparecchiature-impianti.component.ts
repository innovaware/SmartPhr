import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoDipendente } from 'src/app/models/documentoDipendente';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';
import { MansioniService } from '../../service/mansioni.service';

@Component({
  selector: 'app-apparecchiature-impianti',
  templateUrl: './apparecchiature-impianti.component.html',
  styleUrls: ['./apparecchiature-impianti.component.css']
})
export class ApparecchiatureComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "dataScadenza", "note", "action"];


  @ViewChild("paginatorApparecchiature", { static: false })
  ApparecchiaturePaginator: MatPaginator;
  public nuovoApparecchiature: DocumentoDipendente;
  public ApparecchiatureDataSource: MatTableDataSource<DocumentoDipendente>;
  public Apparecchiature: DocumentoDipendente[];
  public uploadingApparecchiature: boolean;
  public addingApparecchiature: boolean;
  public Certifica: String;
  public Verifiche: String;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.uploadingApparecchiature = false;
    this.addingApparecchiature = false;
    this.nuovoApparecchiature = new DocumentoDipendente();
    this.Apparecchiature = [];
    this.ApparecchiatureDataSource = new MatTableDataSource<DocumentoDipendente>();
    this.Certifica = "CertificatiDiConformitaApp";
    this.Verifiche = "VerifichePeriodicheApp";
  }

  ngOnInit() {
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            
            this.dipendente = x[0];
            this.getNomina();
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



  // Apparecchiature
  async addApparecchiature() {
    this.addingApparecchiature = true;
    this.nuovoApparecchiature = {
      filename: undefined,
      note: "",
      type: "Apparecchiature",
    };
  }

  async uploadApparecchiature($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload Apparecchiature: ", $event);
      this.nuovoApparecchiature.filename = file.name;
      this.nuovoApparecchiature.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async deleteApparecchiature(doc: DocumentoDipendente) {
    console.log("Cancella Apparecchiature: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("Apparecchiature cancellata");
        const index = this.Apparecchiature.indexOf(doc);
        console.log("Apparecchiature cancellata index: ", index);
        if (index > -1) {
          this.Apparecchiature.splice(index, 1);
        }

        console.log("Apparecchiature cancellata this.fatture: ", this.Apparecchiature);
        this.ApparecchiatureDataSource.data = this.Apparecchiature;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }

  async saveApparecchiature(doc: DocumentoDipendente) {
    if (!doc.file) {
      this.messageService.showMessageError("Inserire il file");
      return;
    }
    const typeDocument = "Apparecchiature";
    const path = "Apparecchiature";
    const file: File = doc.file;
    this.uploadingApparecchiature = true;

    console.log("Invio Apparecchiature: ", doc);
    console.log("Dipendente: ", this.dipendente);
    this.docService
      .insert(doc, this.dipendente)
      .then((result: DocumentoDipendente) => {
        console.log("Insert Apparecchiature: ", result);
        this.Apparecchiature.push(result);
        this.ApparecchiatureDataSource.data = this.Apparecchiature;
        this.addingApparecchiature = false;
        this.uploadingApparecchiature = false;

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

        let filename = "";
        this.Apparecchiature.forEach((s) => {
          if (this.VerificaMesi(s.dataScadenza)) {
            if (filename === "") filename += "I File: ";
            filename += `${s.filename},\n`;
          }
        });

        if (filename !== "") {
          filename += "Scadranno a Breve\n";
          this.messageService.showMessage(filename);
        }
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento Apparecchiature");
        console.error(err);
      });
  }

  VerificaMesi(dataEvento: Date): boolean {
    // Ottieni la data corrente
    const oggi = new Date();

    // Clona la data dell'evento per evitare di modificarla
    const dataClonata = new Date(dataEvento);

    // Aggiungi due mesi alla data dell'evento
    dataClonata.setMonth(dataClonata.getMonth() - 2);

    // Verifica se la data corrente è esattamente due mesi prima dell'evento
    return oggi >= dataClonata;
  }


  async getNomina() {
    console.log(`get Apparecchiature dipendente: ${this.dipendente._id}`);
    try {
      const f = await this.docService.getByType("Apparecchiature");
      this.Apparecchiature = f;

      let file = "";
      this.Apparecchiature.forEach((s) => {
        if (this.VerificaMesi(s.dataScadenza)) {
          if (file === "") file += "I File: ";
          file += `${s.filename},\n`;
        }
      });

      if (file !== "") {
        file += "Scadranno a Breve\n";
        this.messageService.showMessage(file);
      }

      this.ApparecchiatureDataSource = new MatTableDataSource<DocumentoDipendente>(
        this.Apparecchiature
      );
      this.ApparecchiatureDataSource.paginator = this.ApparecchiaturePaginator;
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento lista Apparecchiature");
      console.error(err);
    }
  }


  public inputSearchField;
  cleanSearchField() {
    this.ApparecchiatureDataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ApparecchiatureDataSource.filter = filterValue.trim().toLowerCase();
  }


}
