import { DatePipe } from '@angular/common';
import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMenuGeneraleComponent } from 'src/app/dialogs/dialog-menu-generale/dialog-menu-generale.component';
import { MenuGeneraleView, TypeMenu } from 'src/app/models/MenuGeneraleView';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { Settings } from '../../models/settings';
import { SettingsService } from '../../service/settings.service';

@Component({
  selector: "app-menu-generale",
  templateUrl: "./menu-generale.component.html",
  styleUrls: ["./menu-generale.component.css"],
})
export class MenuGeneraleComponent implements OnInit {
  displayedColumns: string[] = ["week", "dataStartRif", "dataEndRif", "action"];
  displayedArchivioColumns: string[] = ["week", "type", "dataStartRif", "dataEndRif", "action"];

  settings: Settings;
  currentDate: Date;

  dataSourceMenuGeneraleEstivo: MatTableDataSource<MenuGeneraleView>;
  @ViewChild('paginatorEstivo') paginatorEstivo: MatPaginator;

  dataSourceMenuGeneraleInvernale: MatTableDataSource<MenuGeneraleView>;
  @ViewChild("paginatorInvernale", { static: false }) paginatorInvernale: MatPaginator;

  dataSourceMenuGeneraleArchivio: MatTableDataSource<MenuGeneraleView>;
  @ViewChild("paginatorArchivio", { static: false }) paginatorArchivio: MatPaginator;

  constructor(
    private cucinaService: CucinaService,
    private dialog: MatDialog,
    private messageService: MessagesService,
    private datepipe: DatePipe,
    private setServ: SettingsService
  ) {
    setServ.getSettings().then((set: Settings) => {
      this.settings = set[0];
    });
  }
  ngAfterViewInit() {

    this.dataSourceMenuGeneraleArchivio.paginator = this.paginatorArchivio;
    this.dataSourceMenuGeneraleEstivo.paginator = this.paginatorEstivo;
    this.dataSourceMenuGeneraleInvernale.paginator = this.paginatorInvernale;
  }

  ngOnInit(): void {
    this.initArchivio();

    this.setServ.getSettings().then((set: Settings) => {
      this.settings = set[0];

      this.currentDate = new Date();

      const menuGeneraleEstivoView: MenuGeneraleView[] = [];
      const menuGeneraleInvernaleView: MenuGeneraleView[] = [];
      var startDate = new Date(this.settings.menuEstivoStart);

      for (; startDate < new Date(this.settings.menuEstivoEnd); startDate.setDate(startDate.getDate() + 6)) {
        console.log("Dentro: ", startDate);
        const currentWeek = this.datepipe.transform(startDate, "w");
        const sunday = this.getSunday(startDate);
        const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
        menuGeneraleEstivoView.push({
          year: sunday.getFullYear(),
          week: parseInt(currentWeek, 10),
          type: TypeMenu.Estivo,
          dataInsert: undefined,
          dataStartRif: sunday,
          dataEndRif: saturday,
        });
      }
      console.log(menuGeneraleEstivoView);
      startDate = new Date(this.settings.menuInvernaleStart);
      for (; startDate < new Date(this.settings.menuInvernaleEnd); startDate.setDate(startDate.getDate() + 6)) {
        const currentWeek = this.datepipe.transform(startDate, "w");
        const sunday = this.getSunday(startDate);
        const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
        menuGeneraleInvernaleView.push({
          year: sunday.getFullYear(),
          week: parseInt(currentWeek, 10),
          type: TypeMenu.Invernale,
          dataInsert: undefined,
          dataStartRif: sunday,
          dataEndRif: saturday,
        });

      }

      //let numberWeek = 3 * 4; // 3 month + 4 week
      //for (let index = 0; index < numberWeek; index++) {
      //  const currentWeek = this.datepipe.transform(this.currentDate, "w");
      //  const sunday = this.getSunday(this.currentDate);
      //  const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
      const isEstivo = this.isEstivo(this.currentDate);
      console.log(isEstivo);
      //  if (isEstivo) {
      //    menuGeneraleEstivoView.push({
      //      year: sunday.getFullYear(),
      //      week: parseInt(currentWeek, 10),
      //      type: TypeMenu.Estivo,
      //      dataInsert: undefined,
      //      dataStartRif: sunday,
      //      dataEndRif: saturday,
      //    });
      //  } else {
      //    menuGeneraleInvernaleView.push({
      //      year: sunday.getFullYear(),
      //      week: parseInt(currentWeek, 10),
      //      type: TypeMenu.Invernale,
      //      dataInsert: undefined,
      //      dataStartRif: sunday,
      //      dataEndRif: saturday,
      //    });
      //  }

      //  this.currentDate.setTime(saturday.getTime() + 1 * 24 * 60 * 60 * 1000);
      //}

      this.dataSourceMenuGeneraleEstivo = new MatTableDataSource<MenuGeneraleView>(
        menuGeneraleEstivoView.filter(x => new Date(x.dataEndRif)>new Date())
      );
      this.dataSourceMenuGeneraleEstivo.paginator = this.paginatorEstivo;

      this.dataSourceMenuGeneraleInvernale = new MatTableDataSource<MenuGeneraleView>(
        menuGeneraleInvernaleView.filter(x => new Date(x.dataEndRif) > new Date())
      );
      this.dataSourceMenuGeneraleInvernale.paginator = this.paginatorInvernale;

      let array = menuGeneraleEstivoView.filter(x => new Date(x.dataEndRif) < new Date());
      array.concat(menuGeneraleInvernaleView.filter(x => new Date(x.dataEndRif) < new Date()));
      this.dataSourceMenuGeneraleArchivio.data = array;
      this.dataSourceMenuGeneraleArchivio.paginator = this.paginatorArchivio;
    });
  }

  isEstivo(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();

    switch (month) {
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
    const currentDate = new Date();

    const addMenuToArchivio = (menus: MenuGeneraleView[], type: TypeMenu) => {
      menus.forEach(m => {
        if (new Date(m.dataEndRif) < currentDate) {
          menuGeneraleArchivioView.push(m);
        }
      });
    };

    // Fetch Estivo menus
    this.cucinaService.getMenuGeneraleType(TypeMenu.Estivo)
      .subscribe((menuGeneraleEstivo: MenuGeneraleView[]) => {
        addMenuToArchivio(menuGeneraleEstivo, TypeMenu.Estivo);
        this.refreshArchivio(menuGeneraleArchivioView);
      });

    // Fetch Invernale menus
    this.cucinaService.getMenuGeneraleType(TypeMenu.Invernale)
      .subscribe((menuGeneraleInvernale: MenuGeneraleView[]) => {
        addMenuToArchivio(menuGeneraleInvernale, TypeMenu.Invernale);
        this.refreshArchivio(menuGeneraleArchivioView);
      });
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
      width: `${window.screen.width}px`
    });
  }

  openMenuGenerale(menuGeneraleEstivoView: MenuGeneraleView) {
    this.dialog.open(DialogMenuGeneraleComponent, {
      data: menuGeneraleEstivoView,
      width: `${window.screen.width}px`
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
      width: `${window.screen.width}px`
    });
  }
}
