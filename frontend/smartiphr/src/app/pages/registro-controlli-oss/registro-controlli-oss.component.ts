import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Attivita } from 'src/app/models/attivita';
import { ControlliOSS } from 'src/app/models/controlliOSS';
import { ControlliOSSService } from 'src/app/service/controlli-oss.service';
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-registro-controlli-oss',
  templateUrl: './registro-controlli-oss.component.html',
  styleUrls: ['./registro-controlli-oss.component.css']
})
export class RegistroControlliOssComponent implements OnInit {

  @ViewChild("paginatorControlliOSS", {static: false})
  ControlliOSSPaginator: MatPaginator;
  public controlliOSSDataSource: MatTableDataSource<ControlliOSS>;
  public controlliOSS: ControlliOSS[];

  DisplayedColumns: string[] = ["paziente", "primavera", "estate", "autunno","inverno", "gennaio", "febbraio", "marzo","aprile", "maggio", "giugno", "luglio","agosto","settembre", "ottobre", "novembre","dicembre"];

  constructor( public controlliOSSService: ControlliOSSService,
    public dialog: MatDialog,
    public messageService: MessagesService) { }

  ngOnInit() {
    this.getAllControlli();
  }


  async getAllControlli() {
    console.log(`get Controlli`);
    this.controlliOSSService
      .getAll()
      .then((f: Attivita[]) => {
        this.controlliOSS = f;
        console.log(`get Controlli: ` + JSON.stringify(this.controlliOSS));
        this.controlliOSSDataSource = new MatTableDataSource<ControlliOSS>(
          this.controlliOSS
        );
        this.controlliOSSDataSource.paginator = this.ControlliOSSPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista Controlli"
        );
        console.error(err);
      });
  }


}
