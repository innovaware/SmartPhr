import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { Bonifico } from "src/app/models/bonifico";
import { Consulenti } from "src/app/models/consulenti";
import { Contratto } from "src/app/models/contratto";
import { Fatture } from "src/app/models/fatture";
import { BonificoService } from "src/app/service/bonifico.service";
import { ConsulentiService } from "src/app/service/consulenti.service";
import { ContrattoService } from "src/app/service/contratto.service";
import { FattureService } from "src/app/service/fatture.service";
import { MessagesService } from "src/app/service/messages.service";
import { UploadService } from "src/app/service/upload.service";
import { SettingsService } from "../../service/settings.service";
import { Settings } from "../../models/settings";
import { addDays } from "date-fns/esm/fp";

@Component({
  selector: "app-dialog-consulente",
  templateUrl: "./dialog-consulente.component.html",
  styleUrls: ["./dialog-consulente.component.css"],
})
export class DialogConsulenteComponent implements OnInit {
  disable: boolean;
  public result: Consulenti;

  public uploading: boolean;

  inputSearchFieldBon: String;
  inputSearchFieldFat: String;

  addingContratto: boolean;
  uploadingContratto: boolean;
  nuovaContratto: Contratto;
  contratto: Contratto[];
  public ContrattoDataSource: MatTableDataSource<Contratto>;
  @ViewChild("paginatorContratto", { static: false })
  contrattoPaginator: MatPaginator;
  contrattoDisplayedColumns: string[] = ["namefile", "date", "dataScadenza", "note", "action"];

  addingFattura: boolean;
  uploadingFattura: boolean;
  public nuovaFattura: Fatture;
  public fatture: Fatture[];
  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  public fattureDataSource: MatTableDataSource<Fatture>;
  @ViewChild("paginatorFatture", { static: false })
  fatturePaginator: MatPaginator;

  private settings: Settings;
  public addingBonifici: boolean;
  public nuovaBonifico: Bonifico;
  public uploadingBonifici: boolean;
  public bonifici: Bonifico[];
  @ViewChild("paginatorBonifici", { static: false })
  bonificiPaginator: MatPaginator;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  constructor(
    public uploadService: UploadService,
    public messageService: MessagesService,
    public dialogRef: MatDialogRef<DialogConsulenteComponent>,
    public consulenteService: ConsulentiService,
    public contrattoService: ContrattoService,
    public fattureService: FattureService,
    public bonficoService: BonificoService,
    private settingService: SettingsService,
    @Inject(MAT_DIALOG_DATA)
    public item: {
      consulente: Consulenti;
      isNew: boolean;
      readonly: boolean;
    }
  ) {
    this.disable = item.readonly;
    this.result = undefined;
    this.settings = new Settings();

    this.settingService.getSettings().then((res) => {
      this.settings = res[0];
    });
    this.fatture = [];

    this.addingContratto = false;
    this.uploadingContratto = false;

    this.uploading = false;
    this.uploadingFattura = false;
    this.addingFattura = false;
    this.contratto = [];
    this.ContrattoDataSource = new MatTableDataSource<Contratto>();
    this.uploadingBonifici = false;
  }

  ngOnInit() {
    this.settings = new Settings();
    this.settingService.getSettings().then((res) => {
      this.settings = res[0];
    });
    if (this.item.consulente._id != undefined) {
      this.getContratto();
      this.getFatture();
      this.getBonificiAssegniContanti();
    }
  }



  dateDiff(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24 * 365;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  addDays(date: Date, days: number): Date {
    // Crea una nuova data copiando l'originale
    const newDate = new Date(date);

    // Aggiunge i giorni specificati
    newDate.setDate(newDate.getDate() + days);

    // Ritorna la nuova data
    return newDate;
  }

  save() {
    //this.dialogRef.close(this.item);
    if (
      this.item.consulente.cognome == "" || this.item.consulente.cognome == null || this.item.consulente.cognome === undefined ||
      this.item.consulente.nome == "" || this.item.consulente.nome == null || this.item.consulente.nome === undefined ||
      this.item.consulente.codiceFiscale == "" || this.item.consulente.codiceFiscale == null || this.item.consulente.codiceFiscale === undefined ||
      this.item.consulente.sesso == "" || this.item.consulente.sesso == null || this.item.consulente.sesso === undefined
    ) {

      var campi = "";
      if (this.item.consulente.cognome == "" || this.item.consulente.cognome == null || this.item.consulente.cognome === undefined) {
        campi = campi + " Cognome"
      }

      if (this.item.consulente.nome == "" || this.item.consulente.nome == null || this.item.consulente.nome === undefined) {
        campi = campi + " Nome"
      }

      if (this.item.consulente.codiceFiscale == "" || this.item.consulente.codiceFiscale == null || this.item.consulente.codiceFiscale === undefined) {
        campi = campi + " Codice Fiscale"
      }

      if (this.item.consulente.sesso == "" || this.item.consulente.sesso == null || this.item.consulente.sesso === undefined) {
        campi = campi + " Sesso"
      }

      this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
      return;
    } else {

      if (this.dateDiffInDays(new Date(this.item.consulente.dataNascita), new Date()) < 10) {
        this.messageService.showMessageError("Data di nascita Errata!!!");
        return;
      }
    }

    if (this.item.isNew) {
      this.item.isNew = false;
      this.insert().subscribe(
        (consulente: Consulenti) => {
          this.item.consulente = consulente;
          this.result = this.item.consulente;
        },
        (err) => console.error("Error:", err)
      );
    } else {
      this.update().subscribe(
        (x) => {
          console.log("Save");
          this.result = this.item.consulente;
        },
        (e) => console.error(e)
      );
    }
  }


  private insert(): Observable<Consulenti> {
    return new Observable<Consulenti>((subscriber) => {
      this.consulenteService.insert(this.item.consulente).subscribe(
        (consulente: Consulenti) => {
          console.log("Inserito consulente", consulente);
          subscriber.next(consulente);
        },
        (err) => {
          console.error("Error:", err);
          subscriber.error(err);
        }
      );
    });
  }

  private update(): Observable<Consulenti> {
    return new Observable<Consulenti>((subscriber) => {
      this.consulenteService.update(this.item.consulente).subscribe(
        (result) => {
          console.log("Aggiornato consulente", result);
          subscriber.next(this.item.consulente);
        },
        (err) => {
          console.error("Error:", err);
          subscriber.error(err);
        }
      );
    });
  }

  saveAndClose() {

    if (
      this.item.consulente.cognome == "" || this.item.consulente.cognome == null || this.item.consulente.cognome === undefined ||
      this.item.consulente.nome == "" || this.item.consulente.nome == null || this.item.consulente.nome === undefined ||
      this.item.consulente.codiceFiscale == "" || this.item.consulente.codiceFiscale == null || this.item.consulente.codiceFiscale === undefined ||
      this.item.consulente.sesso == "" || this.item.consulente.sesso == null || this.item.consulente.sesso === undefined
    ) {

      var campi = "";
      if (this.item.consulente.cognome == "" || this.item.consulente.cognome == null || this.item.consulente.cognome === undefined) {
        campi = campi + " Cognome"
      }

      if (this.item.consulente.nome == "" || this.item.consulente.nome == null || this.item.consulente.nome === undefined) {
        campi = campi + " Nome"
      }

      if (this.item.consulente.codiceFiscale == "" || this.item.consulente.codiceFiscale == null || this.item.consulente.codiceFiscale === undefined) {
        campi = campi + " Codice Fiscale"
      }

      if (this.item.consulente.sesso == "" || this.item.consulente.sesso == null || this.item.consulente.sesso === undefined) {
        campi = campi + " Sesso"
      }

      this.messageService.showMessageError(`I campi ${campi} sono obbligatori!!`);
      return;
    } else {

      if (this.dateDiffInDays(new Date(this.item.consulente.dataNascita), new Date()) < 10) {
        this.messageService.showMessageError("Data di nascita Errata!!!");
        return;
      }
    }



    if (this.item.isNew) {
      this.insert().subscribe((consulente: Consulenti) => {
        this.dialogRef.close(consulente);
      });
    } else {
      this.update().subscribe((consulente: Consulenti) => {
        this.dialogRef.close(consulente);
      });
    }
  }

  async getContratto() {
    console.log(`Get Contratto consulente: ${this.item.consulente._id}`);

    if (this.item.consulente._id != undefined) {
      this.contrattoService
        .getContratto(this.item.consulente._id)
        .then((f: Contratto[]) => {
          if (f.length > 0) {
            f = f.filter(x => new Date(x.dataScadenza) > new Date());
            this.contratto[0] = f.length > 0 ? f[0] : undefined;
            //this.contratto.dataupload = new Date(this.contratto.dataupload);
          }
          else {
            this.contratto = [];
          }
          if (this.contratto[0] != undefined) {
            const numScad = this.dateDiff(new Date(),new Date(this.contratto[0].dataScadenza));
            console.log("numero scadenza: ",numScad);
            if (numScad < this.settings.alertContratto.valueOf()) {
              this.messageService.showMessage("Mancano " + numScad + " giorni alla scadenza del contratto");
            }
          }
          this.ContrattoDataSource.data = this.contratto[0] != undefined ? this.contratto : [];
          this.ContrattoDataSource.paginator = this.contrattoPaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore caricamento lista contratto"
          );
          console.error(err);
        });
    }
  }

  async addContratto() {
    this.addingContratto = true;
    this.nuovaContratto = {
      filename: undefined,
      note: "",
    };
  }

  async showContratto(contratto: Contratto) {
    this.uploadService
      .download(contratto.filename, this.item.consulente._id, 'contratti')
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

  async deleteContratto(contratto: Contratto) {
    console.log("Cancella contratto: ", contratto);

    this.contrattoService
      .remove(contratto)
      .then((x) => {
        console.log("Contratto cancellato");
        this.contratto = undefined;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione Contratto"
        );
        console.error(err);
      });
  }

  async uploadContratto($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovaContratto.filename = file.name;
      this.nuovaContratto.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveContratto(contratto: Contratto) {
    if (!contratto.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    if (!contratto.dataScadenza) {
      this.messageService.showMessageError("Inserire una data di scadenza");
      return;
    }
    const typeDocument = "CONTRATTO";
    const path = "contratti";
    const file: File = contratto.file;
    this.uploadingContratto = true;
    this.addingContratto = true;

    console.log("Invio contratto: ", contratto);
    this.contrattoService
      .insert(contratto, this.item.consulente._id)
      .then((result: Contratto) => {
        console.log("Insert contratto: ", result);

        let formData: FormData = new FormData();
        const nameDocument: string = contratto.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.item.consulente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.addingContratto = false;
            this.uploadingContratto = false;
            this.uploading = false;
            this.contratto[0] = result;
            this.ContrattoDataSource.data = this.contratto;
            this.ContrattoDataSource.paginator = this.contrattoPaginator;

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

  async getFatture() {
    console.log(`Get Fatture consulente: ${this.item.consulente._id}`);

    if (this.item.consulente._id != undefined) {
      this.fattureService
        .getByUserId(this.item.consulente._id)
        .then((f: Fatture[]) => {
          this.fatture = f.length > 0 ? f : [];

          this.fattureDataSource = new MatTableDataSource<Fatture>(this.fatture);
          this.fattureDataSource.paginator = this.fatturePaginator;
        })
        .catch((err) => {
          this.messageService.showMessageError("Errore caricamento lista fatture");
          console.error(err);
        });
    }
  }

  async addFattura() {
    this.addingFattura = true;
    this.nuovaFattura = {
      identifyUser: this.item.consulente._id,
      filename: undefined,
      note: "",
    };
  }

  async uploadFattura($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload fattura: ", $event);
      this.nuovaFattura.filename = file.name;
      this.nuovaFattura.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveFattura(fattura: Fatture) {
    if (!fattura.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    const typeDocument = "FATTURE";
    const path = "fatture";
    const file: File = fattura.file;
    this.uploadingFattura = true;

    console.log("Invio fattura: ", fattura);
    this.fattureService
      .insert(fattura, this.item.consulente._id)
      .then((result: Fatture) => {
        console.log("Insert fattura: ", result);
        this.addingFattura = false;

        let formData: FormData = new FormData();
        const nameDocument: string = fattura.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.item.consulente._id}/${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.fatture.push(result);
            this.fattureDataSource.data = this.fatture;
            this.uploadingFattura = false;
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
  async showFattureDocument(fattura: Fatture) {
    this.uploadService
      .download(fattura.filename, this.item.consulente._id, 'fatture')
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

  async deleteFattura(fattura: Fatture) {
    console.log("Cancella fattura: ", fattura);

    this.fattureService
      .remove(fattura)
      .then((x) => {
        console.log("Fattura cancellata");
        const index = this.fatture.indexOf(fattura);
        console.log("Fattura cancellata index: ", index);
        if (index > -1) {
          this.fatture.splice(index, 1);
        }

        console.log("Fattura cancellata this.fatture: ", this.fatture);
        this.fattureDataSource.data = this.fatture;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione Fattura"
        );
        console.error(err);
      });
  }

  async addBonifico() {
    console.log("Add Bonifico");
    this.addingBonifici = true;
    this.nuovaBonifico = {
      identifyUser: this.item.consulente._id,
      filename: undefined,
      note: "",
    };
  }

  async uploadBonifico($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload bonifico: ", $event);
      this.nuovaBonifico.filename = file.name;
      this.nuovaBonifico.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveBonifico(bonifico: Bonifico) {
    if (!bonifico.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }
    const typeDocument = "BONIFICO";
    const path = "bonifico";
    const file: File = bonifico.file;
    this.uploadingBonifici = true;

    this.bonficoService
      .insert(bonifico, this.item.consulente._id)
      .then((result: Bonifico) => {
        console.log("Insert bonifico: ", result);
        this.bonifici.push(result);
        this.bonificiDataSource.data = this.bonifici;
        this.addingBonifici = false;
        this.uploadingBonifici = false;

        let formData: FormData = new FormData();

        const nameDocument: string = bonifico.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${this.item.consulente._id}/${path}`);
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
        this.messageService.showMessageError("Errore Inserimento Nota Credito");
        console.error(err);
      });
  }

  async getBonificiAssegniContanti() {
    console.log(`Get Bonifici e altro: ${this.item.consulente._id}`);
    this.bonficoService
      .getByUserId(this.item.consulente._id)
      .then((f: Bonifico[]) => {
        this.bonifici = f.length > 0 ? f : [];

        this.bonificiDataSource = new MatTableDataSource<Bonifico>(
          this.bonifici
        );
        this.bonificiDataSource.paginator = this.bonificiPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista bonifici e altri"
        );
        console.error(err);
      });
  }

  async showBonificoDocument(bonifico: Bonifico) {
    this.uploadService
      .download(bonifico.filename, this.item.consulente._id, 'bonifico')
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

  async deleteBonifico(bonifico: Bonifico) {
    console.log("Cancella bonifico: ", bonifico);

    this.bonficoService
      .remove(bonifico)
      .then((x) => {
        console.log("Bonifici cancellata");
        const index = this.bonifici.indexOf(bonifico);
        console.log("Bonifici cancellata index: ", index);
        if (index > -1) {
          this.bonifici.splice(index, 1);
        }

        console.log("Bonifici cancellata this.fatture: ", this.bonifici);
        this.bonificiDataSource.data = this.bonifici;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore nella cancellazione Bonifici e altro"
        );
        console.error(err);
      });
  }



  cleanSearchField(type: String) {
    if (type == "Bonifici") {
      this.bonificiDataSource.filter = undefined;
      this.inputSearchFieldBon = undefined;
    }
    if (type == "Fattura") {
      this.fattureDataSource.filter = undefined;
      this.inputSearchFieldFat = undefined;
    }


  }

  applyFilter(event: Event, type: String) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "Bonifici") {
      this.bonificiDataSource.filter = filterValue.trim().toLowerCase();
    }
    if (type == "Fattura") {
      this.fattureDataSource.filter = filterValue.trim().toLowerCase();
    }
  }


}
