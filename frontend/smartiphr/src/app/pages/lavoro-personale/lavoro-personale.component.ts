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

@Component({
  selector: 'app-lavoro-personale',
  templateUrl: './lavoro-personale.component.html',
  styleUrls: ['./lavoro-personale.component.css']
})
export class LavoroPersonaleComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  DisplayedRichiesteColumns: string[] = ["date", "action"];


  @ViewChild("paginatorContratto",{static: false})
  contrattoPaginator: MatPaginator;
  public nuovoContratto: DocumentoDipendente;
  public contrattiDataSource: MatTableDataSource<DocumentoDipendente>;
  public contratti: DocumentoDipendente[];
  public uploadingContratto: boolean;
  public addingContratto: boolean;


  @ViewChild("paginatorCedolini",{static: false})
  cedoliniPaginator: MatPaginator;
  public cedoliniDataSource: MatTableDataSource<DocumentoDipendente>;
  public cedolini: DocumentoDipendente[];


  @ViewChild("paginatorRichieste",{static: false})
  richiestePaginator: MatPaginator;
  public docRichiesta: DocumentoDipendente;
  public richiesteDataSource: MatTableDataSource<DocumentoDipendente>;
  public richieste: DocumentoDipendente[];
  public uploadingDocRichiesta: boolean;
  public addingDocRichiesta: boolean;
 
  

  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService,public dipendenteService: DipendentiService, public authenticationService:AuthenticationService  ) {
      this.loadUser();
    this.uploadingContratto = false;
    this.addingContratto = false;

    this.uploadingDocRichiesta = false;
    this.addingDocRichiesta = false;


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
              this.getContratti();
              this.getCedolini();
              this.getDocsRichiesta();
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



    // CONTRATTI
    async addContratto() {
      this.addingContratto = true;
      this.nuovoContratto = {
        filename: undefined,
        note: "",
        type: "Contratto",
      };
    }
  
    async uploadContratto($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload contratto: ", $event);
        this.nuovoContratto.filename = file.name;
        this.nuovoContratto.file = file;
      } else {
        this.messageService.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
    async deleteContratto(doc: DocumentoDipendente) {
      console.log("Cancella Contratto: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("Contratto cancellata");
          const index = this.contratti.indexOf(doc);
          console.log("Contratto cancellata index: ", index);
          if (index > -1) {
            this.contratti.splice(index, 1);
          }
  
          console.log("Contratto cancellata this.fatture: ", this.contratti);
          this.contrattiDataSource.data = this.contratti;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore nella cancellazione doc identita");
          console.error(err);
        });
    }
  
    async saveContratto(doc: DocumentoDipendente) {
      const typeDocument = "Contratto";
      const path = "Contratto";
      const file: File = doc.file;
      this.uploadingContratto = true;
  
      console.log("Invio Contratto: ", doc);
      this.docService
        .insert(doc, this.dipendente)
        .then((result: DocumentoDipendente) => {
          console.log("Insert Contratto: ", result);
          this.contratti.push(result);
          this.contrattiDataSource.data = this.contratti;
          this.addingContratto = false;
          this.uploadingContratto = false;
  
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
          this.messageService.showMessageError("Errore Inserimento fattura");
          console.error(err);
        });
    }
  
    async getContratti() {
      console.log(`get Contratto dipendente: ${this.dipendente._id}`);
      this.docService
        .get(this.dipendente, "Contratto")
        .then((f: DocumentoDipendente[]) => {
          this.contratti = f;
  
          this.contrattiDataSource = new MatTableDataSource<DocumentoDipendente>(
            this.contratti
          );
          this.contrattiDataSource.paginator = this.contrattoPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore caricamento lista Contratto");
          console.error(err);
        });
    }
  
    // FINE CONTRATTI


      // CEDOLINI

  async getCedolini() {
    console.log(`get Cedolini dipendente: ${this.dipendente._id}`);
    this.docService
      .get(this.dipendente, "Cedolini")
      .then((f: DocumentoDipendente[]) => {
        this.cedolini = f;

        this.cedoliniDataSource = new MatTableDataSource<DocumentoDipendente>(
          this.cedolini
        );
        this.cedoliniDataSource.paginator = this.cedoliniPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista cedolini");
        console.error(err);
      });
  }

  // FINE CEDOLINI



      // RICHIESTE MATERIALI
      async addDocRichiesta() {
        this.addingDocRichiesta = true;
        this.docRichiesta = {
          filename: undefined,
          note: "",
          type: "DocRichiesta",
        };
      }
    
      async uploadDocRichiesta($event) {
        let fileList: FileList = $event.target.files;
        if (fileList.length > 0) {
          let file: File = fileList[0];
    
          console.log("upload Doc Richiesta: ", $event);
          this.docRichiesta.filename = file.name;
          this.docRichiesta.file = file;
        } else {
          this.messageService.showMessageError("File non valido");
          console.error("File non valido o non presente");
        }
      }
    
      async deleteDocRichiesta(doc: DocumentoDipendente) {
        console.log("Cancella Doc Richiesta: ", doc);
    
        this.docService
          .remove(doc)
          .then((x) => {
            console.log("DocRichiesta cancellata");
            const index = this.richieste.indexOf(doc);
            console.log("DocRichiesta cancellata index: ", index);
            if (index > -1) {
              this.richieste.splice(index, 1);
            }
    
            console.log("DocRichiesta cancellata this.richieste: ", this.richieste);
            this.richiesteDataSource.data = this.richieste;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nella cancellazione doc richieste");
            console.error(err);
          });
      }
    
      async saveDocRichiesta(doc: DocumentoDipendente) {
        const typeDocument = "DocRichiesta";
        const path = "DocRichiesta";
        const file: File = doc.file;
        this.uploadingContratto = true;
    
        console.log("Invio DocRichiesta: ", doc);
        this.docService
          .insert(doc, this.dipendente)
          .then((result: DocumentoDipendente) => {
            console.log("Insert DocRichiesta: ", result);
            this.richieste.push(result);
            this.richiesteDataSource.data = this.richieste;
            this.addingDocRichiesta = false;
            this.uploadingDocRichiesta = false;
    
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
            this.messageService.showMessageError("Errore Inserimento fattura");
            console.error(err);
          });
      }
    
      async getDocsRichiesta() {
        console.log(`get DocRichiesta dipendente: ${this.dipendente._id}`);
        this.docService
          .get(this.dipendente, "DocRichiesta")
          .then((f: DocumentoDipendente[]) => {
            this.richieste = f;
    
            this.richiesteDataSource = new MatTableDataSource<DocumentoDipendente>(
              this.richieste
            );
            this.richiesteDataSource.paginator = this.richiestePaginator;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore caricamento lista DocRichiesta");
            console.error(err);
          });
      }
    
      // FINE RICHIESTE MATERIALI

}
