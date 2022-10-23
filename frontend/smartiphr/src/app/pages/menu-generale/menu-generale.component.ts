import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMenuGeneraleComponent } from 'src/app/dialogs/dialog-menu-generale/dialog-menu-generale.component';
import { MenuGeneraleView } from 'src/app/models/MenuGeneraleView';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-menu-generale',
  templateUrl: './menu-generale.component.html',
  styleUrls: ['./menu-generale.component.css']
})
export class MenuGeneraleComponent implements OnInit {


  displayedColumns: string[] = [
    "week",
    "data",
    "descrizione",
    "action",
  ];

  currentDate: Date;
  dataSourceMenuGenerale: MatTableDataSource<MenuGeneraleView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(
    private dialog: MatDialog,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
  }

  addMenuWeek() {
    this.dialog.open(DialogMenuGeneraleComponent, {
      width: `${window.screen.width}px`,
    });
  }

}
