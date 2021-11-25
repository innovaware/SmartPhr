import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA} from "@angular/material";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Documento } from "src/app/models/documento";
import { DocumentoPaziente } from "src/app/models/documentoPaziente";
import { Paziente } from "src/app/models/paziente";
import { schedaAnamnesiFamigliare } from "src/app/models/schedaAnamnesiFamigliare";
import { schedaAnamnesiPatologica } from "src/app/models/schedaAnamnesiPatologica";
import { schedaEsameGenerale } from "src/app/models/schedaEsameGenerale";
import { schedaEsameNeurologia } from "src/app/models/schedaEsameNeurologia";
import { schedaMezziContenzione } from "src/app/models/schedaMezziContenzione";
import { schedaValutazioneTecniche } from "src/app/models/schedaValutazioneTecniche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { DocumentipazientiService } from "src/app/service/documentipazienti.service";
import { MessagesService } from "src/app/service/messages.service";
import { PazienteService } from "src/app/service/paziente.service";
import { UploadService } from "src/app/service/upload.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-cartella-clinica",
  templateUrl: "./dialog-cartella-clinica.component.html",
  styleUrls: ["./dialog-cartella-clinica.component.css"],
})
export class DialogCartellaClinicaComponent implements OnInit {


  schedaAnamnesiFamigliare: schedaAnamnesiFamigliare;
  schedaAnamnesiPatologica: schedaAnamnesiPatologica;
  schedaEsameNeurologia: schedaEsameNeurologia;
  schedaEsameGenerale: schedaEsameGenerale;
  schedaMezziContenzione: schedaMezziContenzione;
  schedaValutazioneTecniche: schedaValutazioneTecniche;

  public newItem: boolean;
  public document: any[] = [];
  public uploading: boolean;


  paziente: Paziente;
  DisplayedColumns: string[] = ["namefile", "date", "note", "action"];


  @ViewChild("paginatorPianiTerapeutici", { static: false }) PianiTerapeuticiPaginator: MatPaginator;
  public nuovoPianoTerapeutico: DocumentoPaziente;
  public pianiTerapeuticiDataSource: MatTableDataSource<DocumentoPaziente>;
  public pianiTerapeutici : DocumentoPaziente[];
  public uploadingPianoTerapeutico: boolean;
  public addingPianoTerapeutico: boolean;



  @ViewChild("paginatorRefertiEsamiStrumentali", { static: false }) RefertiEsamiStrumentaliPaginator: MatPaginator;
  public nuovoRefertoEsameStrumentale: DocumentoPaziente;
  public refertiEsamiStrumentaliDataSource: MatTableDataSource<DocumentoPaziente>;
  public refertiEsamiStrumentali : DocumentoPaziente[];
  public uploadingRefertoEsameStrumentale: boolean;
  public addingRefertoEsameStrumentale: boolean;


  @ViewChild("paginatorRefertiEsamiEmatochimici", { static: false }) RefertiEsamiEmatochimiciPaginator: MatPaginator;
  public nuovoRefertoEsameEmatochimico: DocumentoPaziente;
  public refertiEsamiEmatochimiciDataSource: MatTableDataSource<DocumentoPaziente>;
  public refertiEsamiEmatochimici : DocumentoPaziente[];
  public uploadingRefertoEsameEmatochimico: boolean;
  public addingRefertoEsameEmatochimico: boolean;



  @ViewChild("paginatorVerbali", { static: false }) VerbaliPaginator: MatPaginator;
  public nuovoVerbale: DocumentoPaziente;
  public VerbaliDataSource: MatTableDataSource<DocumentoPaziente>;
  public verbali : DocumentoPaziente[];
  public uploadingVerbale: boolean;
  public addingVerbale: boolean;



  @ViewChild("paginatorRelazioni", { static: false }) RelazioniPaginator: MatPaginator;
  public nuovoRelazione: DocumentoPaziente;
  public relazioniDataSource: MatTableDataSource<DocumentoPaziente>;
  public relazioni : DocumentoPaziente[];
  public uploadingRelazione: boolean;
  public addingRelazione: boolean;


  
  constructor(
    public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public docService: DocumentipazientiService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean
    }
  ) {
    console.log("Dialog Cartella Clinica");

    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.schedaClinica == undefined) {
      this.paziente.schedaClinica = new CartellaClinica();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiFamigliare == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiFamigliare = new schedaAnamnesiFamigliare();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiPatologica == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiPatologica = new schedaAnamnesiPatologica();
    }

    if (this.paziente.schedaClinica.schedaEsameGenerale == undefined) {
      this.paziente.schedaClinica.schedaEsameGenerale = new schedaEsameGenerale();
    }

    if (this.paziente.schedaClinica.schedaEsameNeurologia == undefined) {
      this.paziente.schedaClinica.schedaEsameNeurologia = new schedaEsameNeurologia();
    }

    if (this.paziente.schedaClinica.schedaMezziContenzione == undefined) {
      this.paziente.schedaClinica.schedaMezziContenzione = new schedaMezziContenzione();
    }

    if (this.paziente.schedaClinica.schedaValutazioneTecniche == undefined) {
      this.paziente.schedaClinica.schedaValutazioneTecniche = new schedaValutazioneTecniche();
    }



    this.schedaAnamnesiFamigliare = this.paziente.schedaClinica.schedaAnamnesiFamigliare as schedaAnamnesiFamigliare;
    this.schedaAnamnesiPatologica = this.paziente.schedaClinica.schedaAnamnesiPatologica as schedaAnamnesiPatologica;
    this.schedaEsameGenerale = this.paziente.schedaClinica.schedaEsameGenerale as schedaEsameGenerale;
    this.schedaEsameNeurologia = this.paziente.schedaClinica.schedaEsameNeurologia as schedaEsameNeurologia;
    this.schedaMezziContenzione = this.paziente.schedaClinica.schedaMezziContenzione as schedaMezziContenzione;
    this.schedaValutazioneTecniche = this.paziente.schedaClinica.schedaValutazioneTecniche as schedaValutazioneTecniche;

  }

  ngOnInit(){
    this.getListFile();
    this.getPianiTerapeutici();
  }



  async salva(){

    this.pazienteService.save(this.paziente).then(
      (value: Paziente) => {
        console.log(`Patient  saved`, value);
        this.dialogRef.close(this.paziente);
      }
    )

  }


  async getListFile() {
    console.log(`Get list files paziente: ${this.paziente._id}`);
    this.uploadService
      .getFiles(this.paziente._id)
      .then((documents: Documento[]) => {
        documents.forEach((doc: Documento) => {
          // console.log("document:", doc);
          this.document[doc.typeDocument] = {
            status: true,
            name: doc.name,
            dateupload: doc.dateupload
          };
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento lista Files");
        console.error(err);
      });
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


  // PIANI TERAPEUTICI
  async addPianoTerapeutico() {
    this.addingPianoTerapeutico = true;
    this.nuovoPianoTerapeutico = {
      filename: undefined,
      note: "",
      type: 'PianoTerapeutico'
    };
  }

  async uploadPianoTerapeutico($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload PianoTerapeutico: ", $event);
      this.nuovoPianoTerapeutico.filename = file.name;
      this.nuovoPianoTerapeutico.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deletePianoTerapeutico(doc: DocumentoPaziente) {
    console.log("Cancella PianoTerapeutico: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("PianoTerapeutico cancellata");
        const index = this.pianiTerapeutici.indexOf(doc);
        console.log("PianoTerapeutico cancellata index: ", index);
        if (index > -1) {
          this.pianiTerapeutici.splice(index, 1);
        }

        console.log("PianoTerapeutico cancellato: ", this.pianiTerapeutici);
        this.pianiTerapeuticiDataSource.data = this.pianiTerapeutici;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async savePianoTerapeutico(doc: DocumentoPaziente) {
    const typeDocument = "PianoTerapeutico";
    const path = "PianoTerapeutico";
    const file: File = doc.file;
    this.uploadingPianoTerapeutico = true;

    console.log("Invio PianoTerapeutico: ", doc);
    this.docService
    .insert(doc, this.paziente)
    .then((result: DocumentoPaziente) => {
      console.log("Insert PianoTerapeutico: ", result);
      this.pianiTerapeutici.push(result);
      this.pianiTerapeuticiDataSource.data = this.pianiTerapeutici;
      this.addingPianoTerapeutico = false;
      this.uploadingPianoTerapeutico = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getPianiTerapeutici() {
    console.log(`get PianoTerapeutico paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, 'PianoTerapeutico')
      .then((f: DocumentoPaziente[]) => {
        this.pianiTerapeutici = f;

        this.pianiTerapeuticiDataSource = new MatTableDataSource<DocumentoPaziente>(this.pianiTerapeutici);
        this.pianiTerapeuticiDataSource.paginator = this.PianiTerapeuticiPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista PianoTerapeutico");
        console.error(err);
      });
  }


  // FINE PIANI TERAPEUTICI






   // REFERTI ESAMI STRUMENTALI 
   async addRefertoEsameStrumentale() {
    this.addingRefertoEsameStrumentale = true;
    this.nuovoRefertoEsameStrumentale = {
      filename: undefined,
      note: "",
      type: 'RefertoEsameStrumentale'
    };
  }

  async uploadRefertoEsameStrumentale($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload RefertoEsameStrumentale: ", $event);
      this.nuovoRefertoEsameStrumentale.filename = file.name;
      this.nuovoRefertoEsameStrumentale.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteRefertoEsameStrumentale(doc: DocumentoPaziente) {
    console.log("Cancella RefertoEsameStrumentale: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("RefertoEsameStrumentale cancellata");
        const index = this.refertiEsamiStrumentali.indexOf(doc);
        console.log("RefertoEsameStrumentale cancellata index: ", index);
        if (index > -1) {
          this.refertiEsamiStrumentali.splice(index, 1);
        }

        console.log("RefertoEsameStrumentale cancellato: ", this.refertiEsamiStrumentali);
        this.refertiEsamiStrumentaliDataSource.data = this.refertiEsamiStrumentali;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async saveRefertoEsameStrumentale(doc: DocumentoPaziente) {
    const typeDocument = "RefertoEsameStrumentale";
    const path = "RefertoEsameStrumentale";
    const file: File = doc.file;
    this.uploadingRefertoEsameStrumentale = true;

    console.log("Invio RefertoEsameStrumentale: ", doc);
    this.docService
    .insert(doc, this.paziente)
    .then((result: DocumentoPaziente) => {
      console.log("Insert RefertoEsameStrumentale: ", result);
      this.refertiEsamiStrumentali.push(result);
      this.refertiEsamiStrumentaliDataSource.data = this.refertiEsamiStrumentali;
      this.addingRefertoEsameStrumentale = false;
      this.uploadingRefertoEsameStrumentale = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getRefertiEsamiStrumentali() {
    console.log(`get RefertiEsamiStrumentali paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, 'RefertoEsameStrumentale')
      .then((f: DocumentoPaziente[]) => {
        this.refertiEsamiStrumentali = f;

        this.refertiEsamiStrumentaliDataSource = new MatTableDataSource<DocumentoPaziente>(this.refertiEsamiStrumentali);
        this.refertiEsamiStrumentaliDataSource.paginator = this.RefertiEsamiStrumentaliPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista RefertoEsameStrumentale");
        console.error(err);
      });
  }


  // FINE REFERTI ESAMI STRUMENTALI 





  // REFERTI ESAMI EMAOCHIMIC 
  async addRefertoEsameEmatochimico() {
    this.addingRefertoEsameEmatochimico = true;
    this.nuovoRefertoEsameEmatochimico = {
      filename: undefined,
      note: "",
      type: 'RefertoEsameEmatochimico'
    };
  }

  async uploadRefertoEsameEmatochimico($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload RefertoEsameEmatochimico: ", $event);
      this.nuovoRefertoEsameEmatochimico.filename = file.name;
      this.nuovoRefertoEsameEmatochimico.file = file;

    } else {
      this.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }



  async deleteRefertoEsameEmatochimico(doc: DocumentoPaziente) {
    console.log("Cancella RefertoEsameEmatochimico: ", doc);

    this.docService
      .remove(doc)
      .then((x) => {
        console.log("RefertoEsameEmatochimico cancellata");
        const index = this.refertiEsamiEmatochimici.indexOf(doc);
        console.log("RefertoEsameEmatochimico cancellata index: ", index);
        if (index > -1) {
          this.refertiEsamiEmatochimici.splice(index, 1);
        }

        console.log("RefertoEsameEmatochimico cancellato: ", this.refertiEsamiEmatochimici);
        this.refertiEsamiEmatochimiciDataSource.data = this.refertiEsamiEmatochimici;
      })
      .catch((err) => {
        this.showMessageError("Errore nella cancellazione doc identita");
        console.error(err);
      });
  }
  
  async saveRefertoEsameEmatochimico(doc: DocumentoPaziente) {
    const typeDocument = "RefertoEsameEmatochimico";
    const path = "RefertoEsameEmatochimico";
    const file: File = doc.file;
    this.uploadingRefertoEsameEmatochimico = true;

    console.log("Invio RefertoEsameEmatochimico: ", doc);
    this.docService
    .insert(doc, this.paziente)
    .then((result: DocumentoPaziente) => {
      console.log("Insert RefertoEsameEmatochimico: ", result);
      this.refertiEsamiEmatochimici.push(result);
      this.refertiEsamiEmatochimiciDataSource.data = this.refertiEsamiEmatochimici;
      this.addingRefertoEsameEmatochimico = false;
      this.uploadingRefertoEsameEmatochimico = false;

      let formData: FormData = new FormData();

      const nameDocument: string = doc.filename;

      formData.append("file", file);
      formData.append("typeDocument", typeDocument);
      formData.append("path", `${this.paziente._id}/${path}`);
      formData.append("name", nameDocument);
      this.uploadService
        .uploadDocument(formData)
        .then((x) => {
          this.uploading = false;

          console.log("Uploading completed: ", x);
        })
        .catch((err) => {
          this.showMessageError("Errore nel caricamento file");
          console.error(err);
          this.uploading = false;
        });
    })
    .catch((err) => {
      this.showMessageError("Errore Inserimento fattura");
      console.error(err);
    });
  }



  async getRefertiEsameEmatochimico() {
    console.log(`get RefertoEsameEmatochimico paziente: ${this.paziente._id}`);
    this.docService
      .get(this.paziente, 'RefertoEsameEmatochimico')
      .then((f: DocumentoPaziente[]) => {
        this.refertiEsamiEmatochimici = f;

        this.refertiEsamiEmatochimiciDataSource = new MatTableDataSource<DocumentoPaziente>(this.refertiEsamiEmatochimici);
        this.refertiEsamiEmatochimiciDataSource.paginator = this.RefertiEsamiEmatochimiciPaginator;
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento lista RefertoEsameEmatochimico");
        console.error(err);
      });
  }


  // FINE REFERTI ESAMI EMATOCHIMICI 



    // RELAZIONI 
    async addRelazione() {
      this.addingRelazione = true;
      this.nuovoRelazione = {
        filename: undefined,
        note: "",
        type: 'Relazione'
      };
    }
  
    async uploadRelazione($event) {
      let fileList: FileList = $event.target.files;
      if (fileList.length > 0) {
        let file: File = fileList[0];
  
        console.log("upload Relazione: ", $event);
        this.nuovoRelazione.filename = file.name;
        this.nuovoRelazione.file = file;
  
      } else {
        this.showMessageError("File non valido");
        console.error("File non valido o non presente");
      }
    }
  
  
  
    async deleteRelazione(doc: DocumentoPaziente) {
      console.log("Cancella Relazione: ", doc);
  
      this.docService
        .remove(doc)
        .then((x) => {
          console.log("Relazione cancellata");
          const index = this.relazioni.indexOf(doc);
          console.log("Relazione cancellata index: ", index);
          if (index > -1) {
            this.relazioni.splice(index, 1);
          }
  
          console.log("Relazione cancellato: ", this.relazioni);
          this.relazioniDataSource.data = this.relazioni;
        })
        .catch((err) => {
          this.showMessageError("Errore nella cancellazione doc identita");
          console.error(err);
        });
    }
    
    async saveRelazione(doc: DocumentoPaziente) {
      const typeDocument = "Relazione";
      const path = "Relazione";
      const file: File = doc.file;
      this.uploadingRelazione = true;
  
      console.log("Invio Relazione: ", doc);
      this.docService
      .insert(doc, this.paziente)
      .then((result: DocumentoPaziente) => {
        console.log("Insert Relazione: ", result);
        this.relazioni.push(result);
        this.relazioniDataSource.data = this.relazioni;
        this.addingRelazione = false;
        this.uploadingRelazione = false;
  
        let formData: FormData = new FormData();
  
        const nameDocument: string = doc.filename;
  
        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.paziente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploading = false;
  
            console.log("Uploading completed: ", x);
          })
          .catch((err) => {
            this.showMessageError("Errore nel caricamento file");
            console.error(err);
            this.uploading = false;
          });
      })
      .catch((err) => {
        this.showMessageError("Errore Inserimento fattura");
        console.error(err);
      });
    }
  
  
  
    async getRelazioni() {
      console.log(`get Relazioni paziente: ${this.paziente._id}`);
      this.docService
        .get(this.paziente, 'Relazione')
        .then((f: DocumentoPaziente[]) => {
          this.relazioni = f;
  
          this.relazioniDataSource = new MatTableDataSource<DocumentoPaziente>(this.relazioni);
          this.relazioniDataSource.paginator = this.RelazioniPaginator;
        })
        .catch((err) => {
          this.showMessageError("Errore caricamento lista Relazione");
          console.error(err);
        });
    }
  
  
    // FINE RELAZIONI 




        // VERBALI 
        async addVerbale() {
          this.addingVerbale = true;
          this.nuovoVerbale = {
            filename: undefined,
            note: "",
            type: 'Verbale'
          };
        }
      
        async uploadVerbale($event) {
          let fileList: FileList = $event.target.files;
          if (fileList.length > 0) {
            let file: File = fileList[0];
      
            console.log("upload Verbale: ", $event);
            this.nuovoVerbale.filename = file.name;
            this.nuovoVerbale.file = file;
      
          } else {
            this.showMessageError("File non valido");
            console.error("File non valido o non presente");
          }
        }
      
      
      
        async deleteVerbale(doc: DocumentoPaziente) {
          console.log("Cancella Verbale: ", doc);
      
          this.docService
            .remove(doc)
            .then((x) => {
              console.log("Verbale cancellata");
              const index = this.verbali.indexOf(doc);
              console.log("Verbale cancellata index: ", index);
              if (index > -1) {
                this.verbali.splice(index, 1);
              }
      
              console.log("Verbale cancellato: ", this.verbali);
              this.VerbaliDataSource.data = this.verbali;
            })
            .catch((err) => {
              this.showMessageError("Errore nella cancellazione doc identita");
              console.error(err);
            });
        }
        
        async saveVerbale(doc: DocumentoPaziente) {
          const typeDocument = "Verbale";
          const path = "Verbale";
          const file: File = doc.file;
          this.uploadingVerbale = true;
      
          console.log("Invio Verbale: ", doc);
          this.docService
          .insert(doc, this.paziente)
          .then((result: DocumentoPaziente) => {
            console.log("Insert Verbale: ", result);
            this.verbali.push(result);
            this.VerbaliDataSource.data = this.verbali;
            this.addingVerbale = false;
            this.uploadingVerbale = false;
      
            let formData: FormData = new FormData();
      
            const nameDocument: string = doc.filename;
      
            formData.append("file", file);
            formData.append("typeDocument", typeDocument);
            formData.append("path", `${this.paziente._id}/${path}`);
            formData.append("name", nameDocument);
            this.uploadService
              .uploadDocument(formData)
              .then((x) => {
                this.uploading = false;
      
                console.log("Uploading completed: ", x);
              })
              .catch((err) => {
                this.showMessageError("Errore nel caricamento file");
                console.error(err);
                this.uploading = false;
              });
          })
          .catch((err) => {
            this.showMessageError("Errore Inserimento fattura");
            console.error(err);
          });
        }
      
      
      
        async getVerbali() {
          console.log(`get verbali paziente: ${this.paziente._id}`);
          this.docService
            .get(this.paziente, 'Verbale')
            .then((f: DocumentoPaziente[]) => {
              this.verbali = f;
      
              this.VerbaliDataSource = new MatTableDataSource<DocumentoPaziente>(this.verbali);
              this.VerbaliDataSource.paginator = this.VerbaliPaginator;
            })
            .catch((err) => {
              this.showMessageError("Errore caricamento lista verbali");
              console.error(err);
            });
        }
      
      
        // FINE VERBALI 
}
