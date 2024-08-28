import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogArchivioMenuPersonalizzatoComponent } from 'src/app/dialogs/dialog-archivio-menu-personalizzato/dialog-archivio-menu-personalizzato.component';
import { DialogMenuPersonalizzatoComponent } from 'src/app/dialogs/dialog-menu-personalizzato/dialog-menu-personalizzato.component';
import { CucinaPersonalizzato } from 'src/app/models/cucinaPersonalizzato';
import { MenuPersonalizzatiView } from 'src/app/models/MenuPersonalizzatoView';
import { Paziente } from 'src/app/models/paziente';
import { CucinaPersonalizzatoService } from '../../service/cucinaMenuPersonalizzato.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { ItemMenuPersonalizzato } from '../../models/itemMenuPersonalizzato';
import { ArchivioMenuCucinaPersonalizzatoService } from '../../service/archivioMenuCucinaPersonalizzato.service';
import { ArchivioMenuCucinaPersonalizzato } from '../../models/archivioMenuCucinaPersonalizzato';

@Component({
  selector: 'app-menu-personalizzati',
  templateUrl: './menu-personalizzati.component.html',
  styleUrls: ['./menu-personalizzati.component.css']
})
export class MenuPersonalizzatiComponent implements OnInit {

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataCreazione",
    "dataUltimaModifica",
    "dataInizio",
    "dataFine",
    "action",
  ];

  public dataSourceCucinaPersonalizzato = new MatTableDataSource<ItemMenuPersonalizzato>();
  @ViewChild("menuPersonalizzato", { static: false }) paginator: MatPaginator;
  public dataSourceArchvioCucina = new MatTableDataSource<ItemMenuPersonalizzato>();
  @ViewChild("archvioCucina", { static: false }) paginatorArchivio: MatPaginator;

  constructor(
    private cucinaService: CucinaPersonalizzatoService,
    private pazientiService: PazienteService,
    private ArchivioServ: ArchivioMenuCucinaPersonalizzatoService,
    private dialog: MatDialog,
    private messageService: MessagesService
  ) { }

  ngOnInit() {
    this.getItemMenu();
    this.getArchivio();
  }

  addPaziente() {
    const dialogRef = this.dialog.open(DialogMenuPersonalizzatoComponent, {
      width: `${window.screen.width}px`,
      data: {
        paziente: new Paziente(),
        menu: new CucinaPersonalizzato(),
        add: true,
        readOnly: false
      }
    });

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(() => {
        this.getItemMenu();
        this.getArchivio();
      });
    }
  }

  editPaziente(row: ItemMenuPersonalizzato) {
    const dialogRef = this.dialog.open(DialogMenuPersonalizzatoComponent, {
      width: `${window.screen.width}px`,
      data: {
        paziente: row.paziente,
        menu: row.cucina,
        add: false,
        readOnly: false
      }
    });

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(() => {
        this.getItemMenu();
        this.getArchivio();
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCucinaPersonalizzato.filter = filterValue.trim().toLowerCase();
  }

  cleanSearchField() {
    this.dataSourceCucinaPersonalizzato.filter = '';
  }

  archiveMenuPersonalizzato(element: MenuPersonalizzatiView) {
    this.dialog.open(DialogArchivioMenuPersonalizzatoComponent, {
      width: `${window.screen.width}px`,
      data: {
        idPaziente: element.idPaziente
      }
    });
  }

  async getItemMenu() {
    let items: ItemMenuPersonalizzato[] = [];

    try {
      const res: CucinaPersonalizzato[] = await this.cucinaService.getCucinaPersonalizzato().toPromise();

      // Filtra gli elementi attivi e non scaduti
      const activeItems = res.filter(x =>
        x.active === true &&
        (!x.dataScadenza || new Date(x.dataScadenza) > new Date())
      );

      // Mappa gli elementi attivi a promesse che includono il recupero del paziente
      const promises = activeItems.map(async (cucina) => {
        let item = new ItemMenuPersonalizzato();
        try {
          const paziente: Paziente = await this.pazientiService.getPaziente(cucina.paziente.valueOf());
          item.paziente = paziente[0]; // Assumi che paziente[0] sia corretto
          item.cucina = cucina;
          item.data = cucina.dataCreazione;
          item.dataUM = cucina.dataUltimaModifica;
          item.dataInizio = cucina.dataInizio;
          item.dataFine = cucina.dataFine;
          items.push(item);
        } catch (error) {
          console.error('Errore nel recupero del paziente:', error);
        }
      });

      // Attendi che tutte le promesse siano risolte
      await Promise.all(promises);

      // Aggiorna la datasource e il paginator
      this.dataSourceCucinaPersonalizzato.data = items.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());;
      this.dataSourceCucinaPersonalizzato.paginator = this.paginator;

    } catch (error) {
      console.error('Errore nel recupero dei menu personalizzati:', error);
    }
  }



  getArchivio() {
    let items: ItemMenuPersonalizzato[] = [];

    this.cucinaService.getCucinaPersonalizzato().subscribe((res: CucinaPersonalizzato[]) => {
      const activeItems = res.filter(x =>
        x.active === false ||
        (x.dataScadenza && new Date(x.dataScadenza) < new Date())
      );

      // Crea una lista di promesse
      const promises = activeItems.map((cucina) => {
        // Crea una nuova istanza di ItemMenuPersonalizzato per ogni elemento
        let item = new ItemMenuPersonalizzato();
        return this.pazientiService.getPaziente(cucina.paziente.valueOf()).then((paziente: Paziente) => {
          item.paziente = paziente[0];
          item.cucina = cucina;
          item.data = cucina.dataCreazione;
          item.dataUM = cucina.dataUltimaModifica;
          item.dataInizio = cucina.dataInizio;
          item.dataFine = cucina.dataFine;
          items.push(item);
        });
      });

      // Qui potresti attendere tutte le promesse prima di aggiornare la tua dataSource
      Promise.all(promises).then(() => {
        this.dataSourceArchvioCucina.data = items.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        this.dataSourceArchvioCucina.paginator = this.paginatorArchivio;
      });
    });
  }

  

  viewMenu(row: ItemMenuPersonalizzato) {
    this.pazientiService.getPaziente(row.paziente._id.valueOf()).then((res: Paziente) => {
      const paziente = res[0];
      console.log("paziente: ", paziente);

      const dialogRef = this.dialog.open(DialogMenuPersonalizzatoComponent, {
        width: `${window.screen.width}px`,
        data: {
          paziente: paziente,
          menu: row.cucina,
          add: false,
          readOnly: true
        }
      });

      if (dialogRef) {
        dialogRef.afterClosed().subscribe(() => {
          this.getItemMenu();
          this.getArchivio();
        });
      }
    }).catch(error => {
      console.error("Error fetching paziente:", error);
    });
  }

}
