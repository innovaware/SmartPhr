import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMagazzinoComponent } from 'src/app/dialogs/dialog-magazzino/dialog-magazzino.component';
import { Magazzino } from 'src/app/models/magazzino';
import { MagazzinoService } from 'src/app/service/magazzino.service';

@Component({
  selector: 'app-magazzino',
  templateUrl: './magazzino.component.html',
  styleUrls: ['./magazzino.component.css']
})
export class MagazzinoComponent implements OnInit {
  displayedColumns: string[] = ["nome", "descrizione", "area", "quantita", "giacenza", "conformi", "inuso", "action"];

  dataSourceMagazzino: MatTableDataSource<Magazzino>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  magazzino: Magazzino[];

  constructor(
    private magazzinoService: MagazzinoService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.magazzinoService.getAll()
        .subscribe((magazzino: Magazzino[])=> {
          this.updateData(magazzino);
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
        this.magazzino.push(result);
        this.updateData(this.magazzino);
      }
    });
  }
}
