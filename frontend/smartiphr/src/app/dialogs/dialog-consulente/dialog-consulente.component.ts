import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-dialog-consulente",
  templateUrl: "./dialog-consulente.component.html",
  styleUrls: ["./dialog-consulente.component.css"],
})
export class DialogConsulenteComponent implements OnInit, AfterViewInit {
  disable: boolean;
  public result: Consulenti;
  public uploading: boolean = false;

  inputSearchFieldBon: string = '';
  inputSearchFieldFat: string = '';

  addingContratto: boolean = false;
  uploadingContratto: boolean = false;
  nuovaContratto: Contratto;
  contratto: Contratto[] = [];
  public ContrattoDataSource: MatTableDataSource<Contratto>;
  @ViewChild("paginatorC", { static: false }) contrattoPaginator: MatPaginator;
  contrattoDisplayedColumns: string[] = ["namefile", "date", "dataScadenza", "note", "action"];

  addingFattura: boolean = false;
  uploadingFattura: boolean = false;
  public nuovaFattura: Fatture;
  public fatture: Fatture[] = [];
  fattureDisplayedColumns: string[] = ["namefile", "date", "note", "action"];
  public fattureDataSource: MatTableDataSource<Fatture>;
  @ViewChild("paginatorF", { static: false }) fatturePaginator: MatPaginator;

  private settings: Settings;
  public addingBonifici: boolean = false;
  public nuovaBonifico: Bonifico;
  public uploadingBonifici: boolean = false;
  public bonifici: Bonifico[] = [];
  bonificiDisplayedColumns: string[] = ["namefile", "date", "note", "action"];

  //@ViewChild("paginatorB", { static: false }) bonificiPaginator: MatPaginator;
  @ViewChild('paginatorB') bonificiPaginator!: MatPaginator;
  public bonificiDataSource: MatTableDataSource<Bonifico>;

  constructor(
    public uploadService: UploadService,
    public messageService: MessagesService,
    public dialogRef: MatDialogRef<DialogConsulenteComponent>,
    public consulenteService: ConsulentiService,
    public contrattoService: ContrattoService,
    public fattureService: FattureService,
    public bonificoService: BonificoService,
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
    this.bonifici = [];
    this.addingBonifici = false;
    this.fatture = [];
    this.addingFattura = false;
    this.contratto = [];
    this.addingContratto = false;
    this.ContrattoDataSource = new MatTableDataSource<Contratto>();
    this.fattureDataSource = new MatTableDataSource<Fatture>();
    this.bonificiDataSource = new MatTableDataSource<Bonifico>();
    this.ContrattoDataSource.paginator = null; // Aggiungi questa riga
    this.fattureDataSource.paginator = null; // Aggiungi questa riga
    this.bonificiDataSource.paginator = null; // Aggiungi questa riga
  }

  ngOnInit() {
    this.settingService.getSettings().then((res) => {
      this.settings = res[0];
    });

    if (this.item.consulente._id != undefined) {
      this.getContratto();
      this.getFatture();
      this.getBonificiAssegniContanti();
    }

  }

  ngAfterViewInit() {
    if (this.contrattoPaginator) {
      console.log('Paginator trovato:', this.contrattoPaginator);
      this.ContrattoDataSource.paginator = this.contrattoPaginator;
    }
    if (this.bonificiPaginator) {
      console.log('Paginator trovato:', this.bonificiPaginator);
      this.bonificiDataSource.paginator = this.bonificiPaginator;
    }
    if (this.fatturePaginator) {
      console.log('Paginator trovato:', this.fatturePaginator);
      this.fattureDataSource.paginator = this.fatturePaginator;
    }
  }

  dateDiff(a: Date, b: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  dateDiffInDays(a: Date, b: Date): number {
    const _MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_YEAR);
  }

  addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  async save() {
    if (!this.validateConsulente()) {
      return;
    }

    if (this.item.isNew) {
      await this.consulenteService.insert(this.item.consulente).toPromise();
    } else {
      await this.consulenteService.update(this.item.consulente).toPromise();
    }
    this.messageService.showMessageError(`Salvataggio Effettuato`);
  }

  private validateConsulente(): boolean {
    const requiredFields = [
      { field: 'cognome', label: 'Cognome' },
      { field: 'nome', label: 'Nome' },
      { field: 'codiceFiscale', label: 'Codice Fiscale' },
      { field: 'sesso', label: 'Sesso' }
    ];

    const missingFields = requiredFields
      .filter(({ field }) => !this.item.consulente[field])
      .map(({ label }) => label);

    if (missingFields.length > 0) {
      this.messageService.showMessageError(`I campi ${missingFields.join(', ')} sono obbligatori!!`);
      return false;
    }

    if (this.dateDiffInDays(new Date(this.item.consulente.dataNascita), new Date()) < 10) {
      this.messageService.showMessageError("Data di nascita Errata!!!");
      return false;
    }

    return true;
  }

  async getContratto() {
    console.log(`Get Contratto consulente: ${this.item.consulente._id}`);

    if (!this.item.consulente._id) {
      console.log("ID consulente non definito");
      return;
    }

    try {
      let f: Contratto[] = await this.contrattoService.getContratto(this.item.consulente._id);

      if (f && f.length > 0) {
        f = f.filter(x => new Date(x.dataScadenza) > new Date());
        this.contratto = f.length > 0 ? [f[0]] : [];
      } else {
        this.contratto = [];
      }

      if (this.contratto[0]) {
        const numScad = this.dateDiff(new Date(), new Date(this.contratto[0].dataScadenza));
        console.log("numero scadenza: ", numScad);
        if (numScad < this.settings.alertContratto.valueOf()) {
          this.messageService.showMessage("Mancano " + numScad + " giorni alla scadenza del contratto");
        }
      }

      this.ContrattoDataSource.data = this.contratto;

      setTimeout(() => {
        if (this.contrattoPaginator) {
          this.ContrattoDataSource.paginator = this.contrattoPaginator;
        }
      }, 0);

    } catch (err) {
      console.error("Errore caricamento contratto:", err);
      this.messageService.showMessageError("Errore caricamento lista contratto");
      this.contratto = [];
      this.ContrattoDataSource.data = [];
    }
  }

  async getFatture() {
    console.log(`Get Fatture consulente: ${this.item.consulente._id}`);

    if (!this.item.consulente._id) {
      console.log("ID consulente non definito");
      return;
    }

    try {
      const f: Fatture[] = await this.fattureService.getByUserId(this.item.consulente._id);
      this.fatture = f && f.length > 0 ? f : [];

      this.fattureDataSource = new MatTableDataSource<Fatture>(this.fatture);

      setTimeout(() => {
        if (this.fatturePaginator) {
          this.fattureDataSource.paginator = this.fatturePaginator;
        }
      }, 0);

    } catch (err) {
      console.error("Errore caricamento fatture:", err);
      this.messageService.showMessageError("Errore caricamento lista fatture");
      this.fatture = [];
      this.fattureDataSource = new MatTableDataSource<Fatture>([]);
    }
  }

  async getBonificiAssegniContanti() {
  console.log(`Get Bonifici e altro: ${this.item.consulente._id}`);
  
  if (!this.item.consulente._id) {
    console.log("ID consulente non definito");
    return;
  }
  
  try {
    const f: Bonifico[] = await this.bonificoService.getByUserId(this.item.consulente._id);
    this.bonifici = f && f.length > 0 ? f : [];
    
    this.bonificiDataSource = new MatTableDataSource<Bonifico>(this.bonifici);
    
    // Assegnare il paginator dopo un breve delay per assicurarsi che il ViewChild sia inizializzato
    setTimeout(() => {
      if (this.bonificiPaginator) {
        this.bonificiDataSource.paginator = this.bonificiPaginator;
      }
    }, 0);
    
  } catch (err) {
    console.error("Errore caricamento bonifici:", err);
    this.messageService.showMessageError(
      "Errore caricamento lista bonifici e altri"
    );
    // Inizializzare comunque con array vuoto
    this.bonifici = [];
    this.bonificiDataSource = new MatTableDataSource<Bonifico>([]);
  }
}

  //async getContratto(): Promise<void> {
  //  if (!this.item.consulente._id) return;

  //  try {
  //    const contracts = await this.contrattoService.getContratto(this.item.consulente._id);
  //    if (contracts.length > 0) {
  //      const validContracts = contracts.filter(x => new Date(x.dataScadenza) > new Date());
  //      this.contratto = validContracts.length > 0 ? [validContracts[0]] : [];

  //      if (this.contratto[0]) {
  //        const numScad = this.dateDiff(new Date(), new Date(this.contratto[0].dataScadenza));
  //        if (numScad < this.settings.alertContratto) {
  //          this.messageService.showMessage(`Mancano ${numScad} giorni alla scadenza del contratto`);
  //        }
  //      }
  //    }
  //    this.ContrattoDataSource.data = this.contratto;
  //    this.ContrattoDataSource.paginator = this.contrattoPaginator;
  //  } catch (err) {
  //    this.messageService.showMessageError("Errore caricamento lista contratto");
  //    console.error(err);
  //  }
  //}

  async addContratto(): Promise<void> {
    this.addingContratto = true;
    this.nuovaContratto = {
      filename: undefined,
      note: "",
    };
  }

  async showContratto(contratto: Contratto): Promise<void> {
    try {
      const response = await this.uploadService.download(contratto.filename, this.item.consulente._id, 'contratti');
      response.subscribe((data) => {
        const newBlob = new Blob([data as BlobPart], { type: "application/pdf" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        const downloadURL = URL.createObjectURL(newBlob);
        window.open(downloadURL);
      });
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento file");
      console.error(err);
    }
  }

  async deleteContratto(contratto: Contratto): Promise<void> {
    try {
      await this.contrattoService.remove(contratto);
      this.contratto = undefined;
    } catch (err) {
      this.messageService.showMessageError("Errore nella cancellazione Contratto");
      console.error(err);
    }
  }

  async uploadContratto($event: any): Promise<void> {
    const fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.nuovaContratto.filename = file.name;
      this.nuovaContratto.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
    }
  }

  async saveContratto(contratto: Contratto): Promise<void> {
    if (!contratto.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }

    if (!contratto.dataScadenza) {
      this.messageService.showMessageError("Inserire una data di scadenza");
      return;
    }

    this.uploadingContratto = true;
    this.addingContratto = true;

    contratto.consulenteNome = `${this.item.consulente.cognome}/${this.item.consulente.nome}/${this.item.consulente.codiceFiscale}`;

    try {
      // Initialize array if undefined
      if (!this.contratto) {
        this.contratto = [];
      }

      const result: Contratto = await this.contrattoService.insert(contratto, this.item.consulente._id);

      const formData = new FormData();
      formData.append("file", contratto.file);
      formData.append("typeDocument", "CONTRATTO");
      formData.append("path", `${this.item.consulente._id}/contratti`);
      formData.append("name", contratto.filename);

      await this.uploadService.uploadDocument(formData);

      this.contratto[0] = result;
      this.ContrattoDataSource.data = this.contratto;
    } catch (err) {
      this.messageService.showMessageError("Errore nell'inserimento o caricamento del contratto");
      console.error(err);
    } finally {
      this.addingContratto = false;
      this.uploadingContratto = false;
      this.uploading = false;
    }
  }

  //async getFatture(): Promise<void> {
  //  if (!this.item.consulente._id) return;

  //  try {
  //    const fatture = await this.fattureService.getByUserId(this.item.consulente._id);
  //    this.fatture = fatture || [];
  //    this.fattureDataSource.data = this.fatture;
  //    this.fattureDataSource.paginator = this.fatturePaginator;
  //  } catch (err) {
  //    this.messageService.showMessageError("Errore caricamento lista fatture");
  //    console.error(err);
  //  }
  //}

  async addFattura(): Promise<void> {
    this.addingFattura = true;
    this.nuovaFattura = {
      identifyUser: this.item.consulente._id,
      filename: undefined,
      note: "",
    };
  }

  async uploadFattura($event: any): Promise<void> {
    const fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.nuovaFattura.filename = file.name;
      this.nuovaFattura.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
    }
  }

  async saveFattura(fattura: Fatture): Promise<void> {
    if (!fattura.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }

    this.uploadingFattura = true;

    try {
      const result = await this.fattureService.insert(fattura, this.item.consulente._id);
      this.addingFattura = false;

      const formData = new FormData();
      formData.append("file", fattura.file);
      formData.append("typeDocument", "FATTURE");
      formData.append("path", `${this.item.consulente._id}/fatture`);
      formData.append("name", fattura.filename);

      await this.uploadService.uploadDocument(formData);

      this.fatture.push(result);
      this.fattureDataSource.data = this.fatture;
      this.uploadingFattura = false;
      this.uploading = false;
    } catch (err) {
      this.messageService.showMessageError("Errore nell'inserimento o caricamento della fattura");
      console.error(err);
      this.uploading = false;
    }
  }

  async showFattureDocument(fattura: Fatture): Promise<void> {
    try {
      const response = await this.uploadService.download(fattura.filename, this.item.consulente._id, 'fatture');
      response.subscribe((data) => {
        const newBlob = new Blob([data as BlobPart], { type: "application/pdf" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        const downloadURL = URL.createObjectURL(newBlob);
        window.open(downloadURL);
      });
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento file");
      console.error(err);
    }
  }

  async deleteFattura(fattura: Fatture): Promise<void> {
    try {
      await this.fattureService.remove(fattura);
      const index = this.fatture.indexOf(fattura);
      if (index > -1) {
        this.fatture.splice(index, 1);
      }
      this.fattureDataSource.data = this.fatture;
    } catch (err) {
      this.messageService.showMessageError("Errore nella cancellazione Fattura");
      console.error(err);
    }
  }

  async addBonifico(): Promise<void> {
    this.addingBonifici = true;
    this.nuovaBonifico = {
      identifyUser: this.item.consulente._id,
      filename: undefined,
      note: "",
    };
  }

  async uploadBonifico($event: any): Promise<void> {
    const fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.nuovaBonifico.filename = file.name;
      this.nuovaBonifico.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
    }
  }

  async saveBonifico(bonifico: Bonifico): Promise<void> {
    if (!bonifico.file) {
      this.messageService.showMessageError("Selezionare il file");
      return;
    }

    this.uploadingBonifici = true;

    try {
      const result = await this.bonificoService.insert(bonifico, this.item.consulente._id);
      this.bonifici.push(result);
      this.bonificiDataSource.data = this.bonifici;
      this.addingBonifici = false;
      this.uploadingBonifici = false;

      const formData = new FormData();
      formData.append("file", bonifico.file);
      formData.append("typeDocument", "BONIFICO");
      formData.append("path", `${this.item.consulente._id}/bonifico`);
      formData.append("name", bonifico.filename);

      await this.uploadService.uploadDocument(formData);
      this.uploading = false;
    } catch (err) {
      this.messageService.showMessageError("Errore nell'inserimento o caricamento del bonifico");
      console.error(err);
      this.uploading = false;
    }
  }

  //async getBonificiAssegniContanti(): Promise<void> {
  //  if (!this.item.consulente._id) return;

  //  try {
  //    const bonifici = await this.bonificoService.getByUserId(this.item.consulente._id);
  //    this.bonifici = bonifici || [];
  //    this.bonificiDataSource.data = this.bonifici;
  //    this.bonificiDataSource.paginator = this.bonificiPaginator;
  //  } catch (err) {
  //    this.messageService.showMessageError("Errore caricamento lista bonifici");
  //    console.error(err);
  //  }
  //}

  async showBonificoDocument(bonifico: Bonifico): Promise<void> {
    try {
      const response = await this.uploadService.download(bonifico.filename, this.item.consulente._id, 'bonifico');
      response.subscribe((data) => {
        const newBlob = new Blob([data as BlobPart], { type: "application/pdf" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        const downloadURL = URL.createObjectURL(newBlob);
        window.open(downloadURL);
      });
    } catch (err) {
      this.messageService.showMessageError("Errore caricamento file");
      console.error(err);
    }
  }

  async deleteBonifico(bonifico: Bonifico): Promise<void> {
    try {
      await this.bonificoService.remove(bonifico);
      const index = this.bonifici.indexOf(bonifico);
      if (index > -1) {
        this.bonifici.splice(index, 1);
      }
      this.bonificiDataSource.data = this.bonifici;
    } catch (err) {
      this.messageService.showMessageError("Errore nella cancellazione Bonifico");
      console.error(err);
    }
  }

  applyFilter(event: Event, type: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    switch (type) {
      case "Bonifici":
        this.bonificiDataSource.filter = filterValue;
        break;
      case "Fattura":
        this.fattureDataSource.filter = filterValue;
        break;
    }
  }

  cleanSearchField(type: string): void {
    switch (type) {
      case "Bonifici":
        this.bonificiDataSource.filter = '';
        this.inputSearchFieldBon = '';
        break;
      case "Fattura":
        this.fattureDataSource.filter = '';
        this.inputSearchFieldFat = '';
        break;
    }
  }
}
