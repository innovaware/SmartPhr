import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
    "action",
  ];

  public dataSourceCucinaPersonalizzato = new MatTableDataSource<ItemMenuPersonalizzato>();
  @ViewChild("menuPersonalizzato", { static: false }) paginator: MatPaginator;
  public dataSourceArchvioCucina = new MatTableDataSource<ArchivioMenuCucinaPersonalizzato>();
  @ViewChild("archvioCucina", { static: false }) paginatorArchivio: MatPaginator;

  constructor(
    private cucinaService: CucinaPersonalizzatoService,
    private pazientiService: PazienteService,
    private ArchivioServ: ArchivioMenuCucinaPersonalizzatoService,
    private dialog: MatDialog,
    private messageService: MessagesService,
    private changeDetectorRefs: ChangeDetectorRef
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

  getItemMenu() {
    this.dataSourceCucinaPersonalizzato.data = [];
    let items: ItemMenuPersonalizzato[] = [];

    this.cucinaService.getCucinaPersonalizzato().subscribe((res: CucinaPersonalizzato[]) => {
      const activeItems = res.filter(x => x.active);

      console.log('Active Items:', activeItems); // Debugging output

      activeItems.forEach((cucinaItem) => {
        let item = new ItemMenuPersonalizzato();
        item.cucina = [];
        this.pazientiService.getPaziente(cucinaItem.paziente.valueOf()).then((paziente: Paziente) => {
          let existingItem = items.find(z => z.paziente._id == paziente[0]._id);
          if (existingItem) {
            const index = items.indexOf(existingItem);
            existingItem.cucina.push(cucinaItem);
            items[index] = existingItem;
          } else {
            item.paziente = paziente[0];
            item.cucina.push(cucinaItem);
            item.active = cucinaItem.active;
            item.data = cucinaItem.dataCreazione;
            item.dataUM = cucinaItem.dataUltimaModifica;
            items.push(item);
          }
        }).finally(() => {
          // Ensure this part runs after all promises are resolved
          this.dataSourceCucinaPersonalizzato.data = items;
          this.dataSourceCucinaPersonalizzato.paginator = this.paginator;
          this.changeDetectorRefs.detectChanges();
          console.log('Final Data Source:', this.dataSourceCucinaPersonalizzato.data); // Debugging output
        });
      });
    });
  }

  getArchivio() {
    this.ArchivioServ.get().subscribe((res: ArchivioMenuCucinaPersonalizzato[]) => {
      if (res.length > 0 && res != undefined) {
        this.dataSourceArchvioCucina.data = res;
        this.dataSourceArchvioCucina.paginator = this.paginatorArchivio;
      }
    });
  }

  viewMenu(row: ArchivioMenuCucinaPersonalizzato) {
    this.pazientiService.getPaziente(row.paziente.valueOf()).then((res: Paziente) => {
      const paziente = res[0];
      console.log("paziente: ", paziente);

      const dialogRef = this.dialog.open(DialogMenuPersonalizzatoComponent, {
        width: `${window.screen.width}px`,
        data: {
          paziente: paziente,
          menu: row.menu,
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
