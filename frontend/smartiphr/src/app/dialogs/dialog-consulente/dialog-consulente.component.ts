import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
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

@Component({
  selector: "app-dialog-consulente",
  templateUrl: "./dialog-consulente.component.html",
  styleUrls: ["./dialog-consulente.component.css"],
})
export class DialogConsulenteComponent implements OnInit {
  disable: boolean;
  public result: Consulenti;

  public uploading: boolean;

  addingContratto: boolean;
  uploadingContratto: boolean;
  nuovaContratto: Contratto;
  contratto: Contratto;

  addingFattura: boolean;
  uploadingFattura: boolean;
  public nuovaFattura: Fatture;
  public fatture: Fatture[];
  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  public fattureDataSource: MatTableDataSource<Fatture>;
  @ViewChild("paginatorFatture")
  fatturePaginator: MatPaginator;

  public addingBonifici: boolean;
  public nuovaBonifico: Bonifico;
  public uploadingBonifici: boolean;
  public bonifici: Bonifico[];
  @ViewChild("paginatorBonifici")
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
    @Inject(MAT_DIALOG_DATA)
    public item: {
      consulente: Consulenti;
      isNew: boolean;
      readonly: boolean;
    }
  ) {
    this.disable = item.readonly;
    this.result = undefined;

    this.fatture = [];

    this.addingContratto = false;
    this.uploadingContratto = false;

    this.uploading = false;
    this.uploadingFattura = false;
    this.addingFattura = false;

    this.uploadingBonifici = false;
  }

  ngOnInit() {
    if (this.item.consulente._id != undefined) {
      this.getContratto();
      this.getFatture();
      this.getBonificiAssegniContanti();
    }
  }

  save() {
    //this.dialogRef.close(this.item);
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
            this.contratto = f[0];
            //this.contratto.dataupload = new Date(this.contratto.dataupload);
          }
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

      console.log("upload Contratto: ", $event);
      this.nuovaContratto.filename = file.name;
      this.nuovaContratto.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveContratto(contratto: Contratto) {
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
            this.contratto = result;

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
          this.fatture = f;

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
        this.bonifici = f;

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
}
