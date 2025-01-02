import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Log } from '../../models/log';

@Component({
  selector: 'app-dialog-log',
  templateUrl: './dialog-log.component.html',
  styleUrls: ['./dialog-log.component.css']
})
export class DialogLogComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ["data", "operatore", "className", "operazione"];
  dataSource: MatTableDataSource<Log>;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: Date,
      logs: Log[],
    }) {
    this.dataSource = new MatTableDataSource<Log>();
    this.dataSource.data = this.data.logs;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource<Log>();
    this.dataSource.data = this.data.logs;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Log>();
    this.dataSource.data = this.data.logs;
    this.dataSource.paginator = this.paginator;
  }


  public inputSearchField;
  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
