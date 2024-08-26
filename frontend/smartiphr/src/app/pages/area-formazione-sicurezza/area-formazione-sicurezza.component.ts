import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { NominaDipendente } from '../../models/nominaDipendente';
import { map } from 'rxjs/operators';
import { ItemDataSourceNomina } from '../../models/itemDataSourceNomina';
import { NominaDipendentiService } from '../../service/nominaDipendente.service';
import { MatDialog } from '@angular/material/dialog';
import { FormazioneDipendente } from '../../models/formazioneDipendente';
import { FormazioneDipendentiService } from '../../service/formazioneDipendente.service';

@Component({
  selector: 'app-area-formazione',
  templateUrl: './area-formazione-sicurezza.component.html',
  styleUrls: ['./area-formazione-sicurezza.component.css']
})


export class AreaFormazioneComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  displayedColumns: string[] = [
    "nome",
    "cognome",
    "Esito",
    "DataTest",
    "action",
  ];

  public admin: Boolean;
  @ViewChild("paginatorareaFormaizone", { static: false })
  areaFormaizonePaginator: MatPaginator;
  public nuovoareaFormaizone: DocumentoDipendente;
  public nuovoCorso: FormazioneDipendente;
  public areaFormaizoneDataSource: MatTableDataSource<ItemDataSourceNomina>;
  public areaFormaizone: DocumentoDipendente[];
  public dataSource: ItemDataSourceNomina[];
  public uploadingareaFormaizone: boolean;
  public addingareaFormaizone: boolean;
  public inputSearchField1: String;
  public inputSearchField: Dipendenti;
  public inputSearchField2: String;
  public allDipendenti: Dipendenti[];
  public esito: String;
  public tipo: string;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public nominaService: NominaDipendentiService, public formazioneService: FormazioneDipendentiService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.allDipendenti = [];
    this.dataSource = [];
    this.loadDipendenti();
    this.uploadingareaFormaizone = false;
    this.addingareaFormaizone = false;
    this.nuovoareaFormaizone = new DocumentoDipendente();
    this.nuovoCorso = new FormazioneDipendente();
    this.areaFormaizone = [];
    this.areaFormaizoneDataSource = new MatTableDataSource<ItemDataSourceNomina>();
    this.esito = "";
    this.tipo = "corsiFormazione";
    this.getEsiti();
  }

  ngOnInit() {
    this.dataSource = [];
    this.nuovoareaFormaizone = new DocumentoDipendente();
    this.areaFormaizone = [];
    this.areaFormaizoneDataSource = new MatTableDataSource<ItemDataSourceNomina>();
    this.loadDipendenti();
    this.getEsiti();
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            
            this.dipendente = x[0];
            this.mansioniService.getById(this.dipendente.mansione).then((result) => {
              if (result.codice == "AU" || result.codice == "DA" || result.codice == "RA" || result.codice == "SA") {
                this.admin = true;
              }
            });
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }

  loadDipendenti() {
    this.dipendenteService.get().then((res) => {
      this.allDipendenti = res;
    });
  }

  applyFilterInput(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.dipendenteService.getObservable()
      .pipe(
        map(dipendenti => dipendenti.filter(dipendente =>
          dipendente.nome.toLowerCase().includes(filterValue) ||
          dipendente.cognome.toLowerCase().includes(filterValue)
        ))
      )
      .subscribe(filteredDipendenti => {
        this.allDipendenti = filteredDipendenti;
      });
  }

  addNomina() {
    if (this.inputSearchField !== undefined) {
      const dip = this.inputSearchField;
      this.nuovoCorso.dipendenteID = dip._id;
      this.nuovoCorso.esito = this.esito.valueOf();
      this.nuovoCorso.dataCorso = new Date();
      this.nuovoCorso.attestato = false;

      // Gestione della risposta asincrona
      this.formazioneService.add(this.nuovoCorso).subscribe(
        response => {
          // Aggiorna il data source solo dopo una risposta positiva
          var ds = new ItemDataSourceNomina();
          ds.dipendente = dip;
          ds.formazione = response;
          ds.caricato = false;
          this.dataSource.push(ds);
          this.areaFormaizoneDataSource.data = this.dataSource;
          this.areaFormaizoneDataSource.paginator = this.areaFormaizonePaginator;

          // Resetta i campi di input
          this.inputSearchField = undefined;
          this.esito = "";
        },
        error => {
          console.error("Error during addNomina request:", error);
          // Gestisci l'errore, mostra un messaggio all'utente, ecc.
        }
      );
      this.dataSource.forEach((data) => {
        const index = this.allDipendenti.findIndex(d => d._id === data.dipendente._id);
        if (index > -1) {
          this.allDipendenti.splice(index, 1);
        }
      });
    } else {
      // Gestisci il caso in cui inputSearchField sia undefined
      console.warn("Input search field is undefined. Nomina not added.");
    }
  }

  async showDocument(doc: DocumentoDipendente) {
    const dip = await this.dipendenteService.getById(doc.dipendente.valueOf());
    this.uploadService
      .downloadDocDipendente(doc.filename, doc.type, dip)
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


  ngAfterViewInit() { }
  // areaFormaizone

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
  triggerFileInput(dipendenteId: String) {
    const fileInputElement = this.fileInputs.toArray().find(fileInput => fileInput.nativeElement.id === `fileInput_${dipendenteId}`);
    console.log(fileInputElement);
    if (fileInputElement) {
      fileInputElement.nativeElement.click();
    }
  }

  async uploadDocareaFormaizone($event, item: ItemDataSourceNomina) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      console.log("item: ", item.dipendente);
      this.nuovoareaFormaizone.filename = file.name;
      this.nuovoareaFormaizone.file = file;
      this.nuovoareaFormaizone.type = "areaFormazione";
      this.nuovoareaFormaizone.dipendente = item.dipendente._id;
      console.log(this.nuovoareaFormaizone);
      const typeDocument = "areaFormazione";
      const path = "areaFormazione";
      this.docService
        .insert(this.nuovoareaFormaizone, item.dipendente)
        .then((result: DocumentoDipendente) => {
          let formData1: FormData = new FormData();
          item.documento = result;
          const nameDocument: string = this.nuovoareaFormaizone.filename;

          formData1.append("file", file);
          formData1.append("typeDocument", typeDocument);
          formData1.append("path", `${item.dipendente._id}/${path}`);
          formData1.append("name", nameDocument);
          this.uploadService
            .uploadDocument(formData1)
            .then((x) => {
              this.uploading = false;

              console.log("Uploading completed: ", x);
            })
            .catch((err) => {
              this.messageService.showMessageError("Errore nel caricamento file");
              console.error(err);
              this.uploading = false;
            });

          this.formazioneService.getFormazioniById(item.formazione._id).subscribe((nom) => {
            nom.attestato = true;
            this.formazioneService.Update(nom).subscribe((unom: FormazioneDipendente) => {
              const index = this.dataSource.indexOf(item);
              item.formazione = unom;
              item.caricato = true;
              this.dataSource[index] = item;
              this.areaFormaizoneDataSource.data = this.dataSource;
              this.areaFormaizoneDataSource.paginator = this.areaFormaizonePaginator;
            });
          });

        });
    }
  }

  async getEsiti() {
    try {
      // Fetch all 'formazioni'
      const formazioni = await this.formazioneService.getFormazioni().toPromise();

      // Create an array of promises to fetch dipendente details for each nomina
      const dataSourcePromises = formazioni.map(async (forma) => {
        const dipendente = await this.dipendenteService.getById(forma.dipendenteID.valueOf());
        return {
          dipendente: dipendente,
          formazione: forma,
        };
      });

      // Resolve all promises
      const dataSource: Array<{ dipendente: any, formazione: any, documento?: any, caricato?: Boolean }> = await Promise.all(dataSourcePromises);

      // Fetch documents of type "areaFormaizone"
      const documents = await this.docService.getByType("areaFormazione");

      // Map documents to corresponding dataSource entries
      const documentMap = new Map(documents.map(document => [document.dipendente, document]));

      dataSource.forEach((entry) => {
        const document = documentMap.get(entry.dipendente._id);
        if (document) {
          entry.documento = document;
          entry.caricato = true;
        }
      });

      // Assign the dataSource to the class property and update the paginator
      this.dataSource = dataSource;
      this.areaFormaizoneDataSource.data = this.dataSource;
      this.areaFormaizoneDataSource.paginator = this.areaFormaizonePaginator;
      this.dataSource.forEach((data) => {
        const index = this.allDipendenti.findIndex(d => d._id === data.dipendente._id);
        if (index > -1) {
          this.allDipendenti.splice(index, 1);
        }
      });
    } catch (err) {
      // Show error message to the user and log the error
      this.messageService.showMessageError("Errore caricamento lista antincendio");
      console.error("Error loading data:", err);
    }
  }






  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "areaFormaizone") this.areaFormaizoneDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "areaFormaizone") {
      this.areaFormaizoneDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
  }

  displayFn(dip: Dipendenti): string {
    return dip && dip.nome + ' ' + dip.cognome;
  }
}
