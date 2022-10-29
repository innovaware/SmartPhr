import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMenuGeneraleComponent } from 'src/app/dialogs/dialog-menu-generale/dialog-menu-generale.component';
import { MenuGeneraleView } from 'src/app/models/MenuGeneraleView';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: "app-menu-generale",
  templateUrl: "./menu-generale.component.html",
  styleUrls: ["./menu-generale.component.css"],
})
export class MenuGeneraleComponent implements OnInit {
  displayedColumns: string[] = ["week", "dataStartRif", "dataEndRif", "action"];

  currentDate: Date;
  dataSourceMenuGeneraleEstivo: MatTableDataSource<MenuGeneraleView>;
  @ViewChild('paginatorEstivo') paginatorEstivo: MatPaginator;

  dataSourceMenuGeneraleInvernale: MatTableDataSource<MenuGeneraleView>;
  @ViewChild("paginatorInvernale", {static: false}) paginatorInvernale: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private messageService: MessagesService,
    private datepipe: DatePipe
  ) {}


  ngAfterViewInit() {

    this.dataSourceMenuGeneraleEstivo.paginator = this.paginatorEstivo;
    this.dataSourceMenuGeneraleInvernale.paginator = this.paginatorInvernale;
  }

  ngOnInit(): void {
    this.currentDate = new Date();

    const menuGeneraleEstivoView: MenuGeneraleView[] = [];
    const menuGeneraleInvernaleView: MenuGeneraleView[] = [];

    let numberWeek = 3 * 4; // 3 month + 4 week
    for (let index = 0; index < numberWeek; index++) {
      const currentWeek = this.datepipe.transform(this.currentDate, "w");
      const sunday = this.getSunday(this.currentDate);
      const saturday = new Date(new Date(sunday).setDate(sunday.getDate() + 6));
      console.log(currentWeek);

      menuGeneraleEstivoView.push({
        year: sunday.getFullYear(),
        week: parseInt(currentWeek, 10),
        type: 0,
        dataInsert: undefined,
        dataStartRif: sunday,
        dataEndRif: saturday,
      });


      menuGeneraleInvernaleView.push({
        year: sunday.getFullYear(),
        week: parseInt(currentWeek, 10),
        type: 1,
        dataInsert: undefined,
        dataStartRif: sunday,
        dataEndRif: saturday,
      });

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

  openMenuGeneraleEstivo(menuGeneraleEstivoView: MenuGeneraleView) {
    this.dialog.open(DialogMenuGeneraleComponent, {
      data: menuGeneraleEstivoView,
      width: `${window.screen.width}px`,
    });
  }

}
