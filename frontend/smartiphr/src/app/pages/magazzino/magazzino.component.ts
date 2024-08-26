import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCaricoMagazzinoComponent } from 'src/app/dialogs/dialog-carico-magazzino/dialog-carico-magazzino.component';
import { DialogMagazzinoComponent } from 'src/app/dialogs/dialog-magazzino/dialog-magazzino.component';
import { Magazzino, TypeProcedureMagazzino } from 'src/app/models/magazzino';
import { MagazzinoOperazioni } from 'src/app/models/magazzinoOperazioni';
import { User } from 'src/app/models/user';
import { MagazzinoService } from 'src/app/service/magazzino.service';
import { UsersService } from 'src/app/service/users.service';

export class MagazzinoOperazioniView {
  dateInsert: Date;
  user: User;
  tipologiaOperazione: string;
  idMagazzino: string;
  magazzino: Magazzino;
}


@Component({
  selector: 'app-magazzino',
  templateUrl: './magazzino.component.html',
  styleUrls: ['./magazzino.component.css']
})
export class MagazzinoComponent implements OnInit {
  displayedColumns: string[] = ["nome", "descrizione", "area", "quantita", "giacenza", "conformi", "inuso", "action"];
  displayedColumnsOperazioni: string[] = ["dateInsert", "user", "tipologiaOperazione", "nome"];

  dataSourceMagazzino: MatTableDataSource<Magazzino>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSourceMagazzinoOperazioni: MatTableDataSource<MagazzinoOperazioniView>;
  @ViewChild("paginatorOperazioni", {static: false}) paginatorOperazioni: MatPaginator;

  magazzino: Magazzino[];

  constructor(
    private userService: UsersService,
    private magazzinoService: MagazzinoService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.load();
  }

  load () {
    this.loadData();
    this.loadOperazioni();
  }

  loadData() {
    this.magazzinoService.getAll()
        .subscribe((magazzino: Magazzino[])=> {
          this.updateData(magazzino);
        });
  }

  loadOperazioni() {
    this.magazzinoService.getOperazioni()
        .subscribe((operazioni: MagazzinoOperazioni[])=> {
          const operazioniView: MagazzinoOperazioniView[] = [];

          operazioni.forEach(async op => {
            const magazzino = await this.magazzinoService.get(op.idMagazzino).toPromise();
            const user = await this.userService.getById(op.idUser);
            if (magazzino && user) {
              operazioniView.push({
                dateInsert: op.dateInsert,
                tipologiaOperazione: op.tipologiaOperazione,
                idMagazzino: op.idMagazzino,
                magazzino,
                user: await this.userService.getById(op.idUser)
              });

            }

            this.dataSourceMagazzinoOperazioni = new MatTableDataSource<MagazzinoOperazioniView>(
              operazioniView.sort((a, b) => new Date(b.dateInsert).getTime() - new Date(a.dateInsert).getTime()));
            this.dataSourceMagazzinoOperazioni.paginator = this.paginatorOperazioni;
          })
        });
  }

  updateData(magazzino: Magazzino[]) {
    this.magazzino = magazzino;
    this.dataSourceMagazzino = new MatTableDataSource<Magazzino>(this.magazzino);
    this.dataSourceMagazzino.paginator = this.paginator;
  }

  details(item: Magazzino) {
    this.dialog.open(DialogMagazzinoComponent, {
      data: { magazzino: item, isNew: false},
      width: `${window.screen.width}px`,
      height: `${800}px`
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.updateData(this.magazzino);
        this.loadOperazioni();
      }
    });
  }

  carico(item: Magazzino) {
    this.dialog.open(DialogCaricoMagazzinoComponent, {
      data: { magazzino: item, type: TypeProcedureMagazzino.Carico},
      width: `${window.screen.width}px`,
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.updateData(this.magazzino);
        this.loadOperazioni();
      }
    });

  }

  scarico(item: Magazzino) {
    this.dialog.open(DialogCaricoMagazzinoComponent, {
      data: { magazzino: item, type: TypeProcedureMagazzino.Scarico},
      width: `${window.screen.width}px`,
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.updateData(this.magazzino);
        this.loadOperazioni();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMagazzino.filter = filterValue
      .trim()
      .toLowerCase();
  }

  addNewMaterialeMagazzino() {
    this.dialog.open(DialogMagazzinoComponent, {
      data: { undefined, isNew: true},
      width: `${window.screen.width}px`,
      height: `${800}px`
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.load();
      }
    });
  }
}
