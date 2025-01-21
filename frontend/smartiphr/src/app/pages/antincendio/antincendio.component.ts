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

@Component({
  selector: 'app-antincendio',
  templateUrl: './antincendio.component.html',
  styleUrls: ['./antincendio.component.css']
})


export class AntincendioComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  displayedColumns: string[] = [
    "nome",
    "cognome",
    "Nomina",
    "DataNomina",
    "action",
  ];

  public admin: Boolean;
  @ViewChild("paginatorantincendio", { static: false })
  antincendioPaginator: MatPaginator;
  public nuovoantincendio: DocumentoDipendente;
  public antincendioDataSource: MatTableDataSource<ItemDataSourceNomina>;
  public antincendio: DocumentoDipendente[];
  public dataSource: ItemDataSourceNomina[];
  public uploadingantincendio: boolean;
  public addingantincendio: boolean;
  public inputSearchField1: String;
  public inputSearchField: Dipendenti;
  public inputSearchField2: String;
  public allDipendenti: Dipendenti[];


  @ViewChild("paginatorattestatiAntincendio", { static: false })
  attestatiAntincendioPaginator: MatPaginator;
  public attestatiAntincendioDataSource: MatTableDataSource<ItemDataSourceNomina>;



  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public docService: DocumentiService,
    public uploadService: UploadService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public nominaService: NominaDipendentiService,
    public mansioniService: MansioniService)
  {
    this.loadUser();
    this.allDipendenti = [];
    this.dataSource = [];
    this.getantincendio();
    this.loadDipendenti();
    this.uploadingantincendio = false;
    this.addingantincendio = false;
    this.nuovoantincendio = new DocumentoDipendente();
    this.antincendio = [];
    this.antincendioDataSource = new MatTableDataSource<ItemDataSourceNomina>();
    this.attestatiAntincendioDataSource = new MatTableDataSource<ItemDataSourceNomina>();
  }

  ngOnInit() {
    this.dataSource = [];
    this.getantincendio();
    this.loadDipendenti();
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
      if (this.authenticationService.getCurrentUser().role == "66aa1532b6f9db707c1c2010")
        this.allDipendenti = res;
      else
        this.allDipendenti = res.filter(x => x.mansione != "66aa1532b6f9db707c1c2010");
    });
    this.dataSource.forEach((data) => {
      const index = this.allDipendenti.findIndex(d => d._id === data.dipendente._id);
      if (index > -1) {
        this.allDipendenti.splice(index, 1);
      }
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
          if (this.authenticationService.getCurrentUser().role == "66aa1532b6f9db707c1c2010")
            this.allDipendenti = filteredDipendenti;
          else
            this.allDipendenti = filteredDipendenti.filter(x => x.mansione != "66aa1532b6f9db707c1c2010");
      });
  }

  addNomina() {
    if (this.inputSearchField !== undefined) {
      const dip = this.inputSearchField;
      var nd = new NominaDipendente();
      nd.dipendenteID = dip._id;
      nd.nomina = "Responsabile Antincendio";
      nd.dataNomina = new Date();
      console.log(nd);
      this.nominaService.addNomina(nd).subscribe((res) => {
        const index = this.allDipendenti.findIndex(d => d._id === dip._id);
        console.log("Contratto cancellata index: ", index);
        if (index > -1) {
          this.allDipendenti.splice(index, 1);
        }
        var ds = new ItemDataSourceNomina();
        ds.dipendente = dip;
        ds.nomina = res;
        this.dataSource.push(ds);
        this.antincendioDataSource.data = this.dataSource;
        this.antincendioDataSource.paginator = this.antincendioPaginator;
        this.attestatiAntincendioDataSource.data = this.dataSource;
        this.attestatiAntincendioDataSource.paginator = this.attestatiAntincendioPaginator;

        this.inputSearchField = undefined;
      });
      this.dataSource.forEach((data) => {
        const index = this.allDipendenti.findIndex(d => d._id === data.dipendente._id);
        if (index > -1) {
          this.allDipendenti.splice(index, 1);
        }
      });
    }
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


  ngAfterViewInit(){ }
  // antincendio

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
  triggerFileInput(dipendenteId: String) {
    const fileInputElement = this.fileInputs.toArray().find(fileInput => fileInput.nativeElement.id === `fileInput_${dipendenteId}`);
    console.log(fileInputElement);
    if (fileInputElement) {
      fileInputElement.nativeElement.click();
    }
  }

  async uploadDocAntincendio($event, item: ItemDataSourceNomina) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      console.log("item: ", item.dipendente);
      this.nuovoantincendio.filename = file.name;
      this.nuovoantincendio.file = file;
      this.nuovoantincendio.type = "Antincendio";
      this.nuovoantincendio.dipendente = item.dipendente._id;
      const typeDocument = "Antincendio";
      const path = "Antincendio";
      this.docService
        .insert(this.nuovoantincendio, item.dipendente)
        .then((result: DocumentoDipendente) => {
          let formData: FormData = new FormData();
          item.documento = result;
          const nameDocument: string = this.nuovoantincendio.filename;

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
          this.nominaService.getNomineById(item.nomina._id).subscribe((nom) => {
            nom.nominato = true;
            this.nominaService.Update(nom).subscribe((unom: NominaDipendente) => {
              const index = this.dataSource.indexOf(item);
              item.nomina = unom;
              this.dataSource[index] = item;
              this.antincendioDataSource.data = this.dataSource;
              this.antincendioDataSource.paginator = this.antincendioPaginator;

              this.attestatiAntincendioDataSource.data = this.dataSource;
              this.attestatiAntincendioDataSource.paginator = this.attestatiAntincendioPaginator;

            });
          });

        });
    }
  }


  async getantincendio() {
    try {
      // Fetch the list of nomine
      const nomine = await this.nominaService.getNomine().toPromise();

      // Create an array of promises to fetch dipendente details for each nomina
      const dataSourcePromises = nomine.map(async (nomina) => {
        const dipendente = await this.dipendenteService.getById(nomina.dipendenteID.valueOf());
        return {
          dipendente: dipendente,
          nomina: nomina,
        };
      });

      // Resolve all promises
      var dataSource = await Promise.all(dataSourcePromises);

      // Fetch documents of type "Antincendio"
      const documents = await this.docService.getByType("Antincendio");

      // Map documents to corresponding dataSource entries
      documents.forEach((document) => {
        dataSource.forEach((entry: ItemDataSourceNomina) => {
          if (document.dipendente === entry.dipendente._id) {
            entry.documento = document;
          }
        });
      });

      // Fetch documents of type "Antincendio"
      const documentsAtt = await this.docService.getByType("AttestatoAntincendio");

      // Map documents to corresponding dataSource entries
      documentsAtt.forEach((document) => {
        dataSource.forEach((entry: ItemDataSourceNomina) => {
          if (document.dipendente === entry.dipendente._id) {
            entry.documentoAttestato = document;
          }
        });
      });
      if (dataSource.length <= 0) {
        dataSource = [];
      }
      // Assign dataSource to the component's property
      this.dataSource = dataSource;
      // Set the dataSource for the antincendioDataSource and its paginator
      this.antincendioDataSource.data = this.dataSource;
      this.antincendioDataSource.paginator = this.antincendioPaginator;

      this.attestatiAntincendioDataSource.data = this.dataSource;
      this.attestatiAntincendioDataSource.paginator = this.attestatiAntincendioPaginator;
      // Remove all employees present in dataSource from allDipendenti
      this.dataSource.forEach((data) => {
        const index = this.allDipendenti.findIndex(d => d._id === data.dipendente._id);
        if (index > -1) {
          this.allDipendenti.splice(index, 1);
        }
      });

    } catch (err) {
      // Show error message to the user and log the error
      this.messageService.showMessageError("Errore caricamento lista antincendio");
      console.error(err);
    }
  }




  // FINE antincendio


  // attestatiAntincendio

  @ViewChildren('fileInput1') fileInputs1!: QueryList<ElementRef>;
  triggerFileInput1(dipendenteId: String) {
    console.log(dipendenteId);
    console.log(this.fileInputs1);
    const fileInputElement = this.fileInputs1.toArray().find(fileInput => fileInput.nativeElement.id === `fileInput_${dipendenteId}`);
    console.log(fileInputElement);
    if (fileInputElement) {
      fileInputElement.nativeElement.click();
    }
  }
  async uploadDocAttestatoAntincendio($event, item: ItemDataSourceNomina) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      
      this.nuovoantincendio.filename = file.name;
      this.nuovoantincendio.file = file;
      this.nuovoantincendio.type = "AttestatoAntincendio";
      this.nuovoantincendio.dipendente = item.dipendente._id;
      const typeDocument = "AttestatoAntincendio";
      const path = "AttestatoAntincendio";
      this.docService
        .insert(this.nuovoantincendio, item.dipendente)
        .then((result: DocumentoDipendente) => {
          let formData: FormData = new FormData();
          item.documentoAttestato = result;
          const nameDocument: string = this.nuovoantincendio.filename;

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
          this.nominaService.getNomineById(item.nomina._id).subscribe((nom) => {
            nom.attestato = true;
            this.nominaService.Update(nom).subscribe((unom: NominaDipendente) => {
              const index = this.dataSource.indexOf(item);
              item.nomina = unom;
              this.dataSource[index] = item;
              this.antincendioDataSource.data = this.dataSource;
              this.antincendioDataSource.paginator = this.antincendioPaginator;

              this.attestatiAntincendioDataSource.data = this.dataSource;
              this.attestatiAntincendioDataSource.paginator = this.attestatiAntincendioPaginator;
            });
          });

        });
    }
  }


  applyFilter(event: Event, type: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (type == "antincendio") this.antincendioDataSource.filter = filterValue.trim().toLowerCase();
    if (type == "attestatiAntincendio") this.attestatiAntincendioDataSource.filter = filterValue.trim().toLowerCase();
  }


  cleanSearchField(type: string) {
    if (type == "antincendio") {
      this.antincendioDataSource.filter = undefined;
      this.inputSearchField1 = undefined;
    }
    if (type == "attestatiAntincendio") {
      this.attestatiAntincendioDataSource.filter = undefined;
      this.inputSearchField2 = undefined;
    }

  }

  displayFn(dip: Dipendenti): string {
    return dip && dip.nome + ' ' + dip.cognome;
  }
}
