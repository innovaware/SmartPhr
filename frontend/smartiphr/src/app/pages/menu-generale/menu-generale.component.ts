import { DatePipe } from '@angular/common';
import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMenuGeneraleComponent } from 'src/app/dialogs/dialog-menu-generale/dialog-menu-generale.component';
import { MenuGeneraleView, TypeMenu } from 'src/app/models/MenuGeneraleView';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: "app-menu-generale",
  templateUrl: "./menu-generale.component.html",
  styleUrls: ["./menu-generale.component.css"],
})
export class MenuGeneraleComponent implements OnInit {
  displayedColumns: string[] = ["week", "dataStartRif", "dataEndRif", "action"];
  displayedArchivioColumns: string[] = ["week", "type", "dataStartRif", "dataEndRif", "action"];


  currentDate: Date;

  dataSourceMenuGeneraleEstivo: MatTableDataSource<MenuGeneraleView>;
  @ViewChild('paginatorEstivo') paginatorEstivo: MatPaginator;

  dataSourceMenuGeneraleInvernale: MatTableDataSource<MenuGeneraleView>;
  @ViewChild("paginatorInvernale", {static: false}) paginatorInvernale: MatPaginator;

  dataSourceMenuGeneraleArchivio: MatTableDataSource<MenuGeneraleView>;
  @ViewChild("paginatorArchivio", {static: false}) paginatorArchivio: MatPaginator;

  constructor(
    private cucinaService: CucinaService,
    private dialog: MatDialog,
    private messageService: MessagesService,
    private datepipe: DatePipe
  ) {}
  ngAfterViewInit() {

    this.dataSourceMenuGeneraleEstivo.paginator = this.paginatorEstivo;
    this.dataSourceMenuGeneraleInvernale.paginator = this.paginatorInvernale;
  }

  ngOnInit(): void {
    this.initArchivio();

    this.currentDate = new Date();

    const menuGeneraleEstivoView: MenuGeneraleView[] = [];
    const menuGeneraleInvernaleView: MenuGeneraleView[] = [];

    let numberWeek = 3 * 4; // 3 month + 4 week
    for (let index = 0; index < numberWeek; index++) {
      const currentWeek = this.datepipe.transform(this.currentDate, "w");
      const sunday = this.getSunday(this.currentDate);
      const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
      const isEstivo = this.isEstivo(this.currentDate);

      if (isEstivo) {
        menuGeneraleEstivoView.push({
          year: sunday.getFullYear(),
          week: parseInt(currentWeek, 10),
          type: TypeMenu.Estivo,
          dataInsert: undefined,
          dataStartRif: sunday,
          dataEndRif: saturday,
        });
      } else {
        menuGeneraleInvernaleView.push({
          year: sunday.getFullYear(),
          week: parseInt(currentWeek, 10),
          type: TypeMenu.Invernale,
          dataInsert: undefined,
          dataStartRif: sunday,
          dataEndRif: saturday,
        });
      }

      this.currentDate.setTime(saturday.getTime() + 1 * 24 * 60 * 60 * 1000);
    }

    this.dataSourceMenuGeneraleEstivo = new MatTableDataSource<MenuGeneraleView>(
      menuGeneraleEstivoView
    );
    this.dataSourceMenuGeneraleEstivo.paginator = this.paginatorEstivo;

    this.dataSourceMenuGeneraleInvernale = new MatTableDataSource<MenuGeneraleView>(
      menuGeneraleInvernaleView
    );
    this.dataSourceMenuGeneraleInvernale.paginator = this.paginatorInvernale;
  }

  isEstivo(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth()+1;
    const day = new Date(date).getDate();

    switch( month) {
      case 12:
      case 1:
      case 2:
        return false;
      case 3:
        return day < 20;
      default:
        return true;
    }
  }

  initArchivio() {
    this.currentDate = new Date();
    const menuGeneraleArchivioView: MenuGeneraleView[] = [];
    let numberWeek = 3 * 4; // 3 month + 4 week
    for (let index = 0; index < numberWeek; index++) {
      const currentWeek = this.datepipe.transform(this.currentDate, "w");
      const sunday = this.getSunday(this.currentDate);
      const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));

      const menuEstivo = {}
      const menuInvernale = {}

      this.cucinaService.getMenuGenerale(TypeMenu.Estivo, parseInt(currentWeek,10), sunday.getFullYear() )
          .subscribe( (menuGenerale: MenuGeneraleView[]) => {

            menuGenerale.forEach(m=> {
              menuEstivo[m.week]=m;
            })

            for (const key in menuEstivo) {
              const element = menuEstivo[key];
              menuGeneraleArchivioView.push(element);
            }

            this.refreshArchivio(menuGeneraleArchivioView);
          });

      this.cucinaService.getMenuGenerale(TypeMenu.Invernale, parseInt(currentWeek,10), sunday.getFullYear() )
          .subscribe( (menuGenerale: MenuGeneraleView[]) => {
            menuGenerale.forEach(m=> {
              menuInvernale[m.week]=m;
            })

            for (const key in menuInvernale) {
              const element = menuInvernale[key];
              menuGeneraleArchivioView.push(element);
            }

            this.refreshArchivio(menuGeneraleArchivioView);
          });

      this.currentDate.setTime(saturday.getTime() + 1 * 24 * 60 * 60 * 1000);
    }
  }

  refreshArchivio(data: MenuGeneraleView[]) {
    this.dataSourceMenuGeneraleArchivio = new MatTableDataSource<MenuGeneraleView>(
      data
    );
    this.dataSourceMenuGeneraleArchivio.paginator = this.paginatorArchivio;
  }

  getSunday(dateInput: Date) {
    const d = new Date(dateInput);
    const day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  addMenuWeek() {
    this.dialog.open(DialogMenuGeneraleComponent, {
      width: `${window.screen.width}px`,
    });
  }

  openMenuGenerale(menuGeneraleEstivoView: MenuGeneraleView) {
    this.dialog.open(DialogMenuGeneraleComponent, {
      data: menuGeneraleEstivoView,
      width: `${window.screen.width}px`,
    });
  }

  openMenuGeneraleArchivio(menuGeneraleEstivoView: MenuGeneraleView, type: number) {
    const data: MenuGeneraleView = MenuGeneraleView.clone(menuGeneraleEstivoView);
    data.type = type;
    data.dataStartRif = new Date(data.dataStartRif);
    data.dataEndRif = new Date(data.dataEndRif);
    data.dataInsert = new Date(data.dataInsert);

    this.dialog.open(DialogMenuGeneraleComponent, {
      data,
      width: `${window.screen.width}px`,
    });
  }
}
