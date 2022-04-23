import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Attivita } from 'src/app/models/attivita';
import { ControlliOSS } from 'src/app/models/controlliOSS';
import { RegistroArmadio } from 'src/app/models/RegistroArmadio';
import { ArmadioService } from 'src/app/service/armadio.service';
import { ControlliOSSService } from 'src/app/service/controlli-oss.service';
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-registro-controlli-oss',
  templateUrl: './registro-controlli-oss.component.html',
  styleUrls: ['./registro-controlli-oss.component.css']
})
export class RegistroControlliOssComponent implements OnInit {

  public registroArmadioDataSource: MatTableDataSource<RegistroArmadio>;
  DisplayedColumns: string[] = [
    "cameraId",
    "stato",
    "data",
    "note",
    "firma"
  ];

  ngOnInit(): void {
  }

  constructor(
    private registroArmadioService: ArmadioService
  ) {
    this.registroArmadioService.getRegistro()
      .pipe(
      map( (r: RegistroArmadio[]) =>
      r.map((x: RegistroArmadio)=> {
        return {
            ...x,
            cameraInfo: x.cameraInfo[0],
            userInfo: x.userInfo[0]
        }
      }))
    ).subscribe((registro: RegistroArmadio[])=> {
      console.log(registro);

      this.registroArmadioDataSource = new MatTableDataSource<RegistroArmadio>(registro);
    });
  }


}
