import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RegistroArmadio } from 'src/app/models/RegistroArmadio';
import { ArmadioService } from 'src/app/service/armadio.service';
import { ControlliOSSService } from 'src/app/service/controlli-oss.service';
import { MessagesService } from 'src/app/service/messages.service';
import { CamereService } from '../../service/camere.service';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';


@Component({
  selector: 'app-registro-controlli-oss',
  templateUrl: './registro-controlli-oss.component.html',
  styleUrls: ['./registro-controlli-oss.component.css']
})
export class RegistroControlliOssComponent implements OnInit {

  public registroArmadioDataSource: MatTableDataSource<RegistroArmadio>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  DisplayedColumns: string[] = [
    "paziente",
    "cameraId",
    "armadio",
    "stato",
    "data",
    "note",
    "firma"
  ];

  ngOnInit(): void {
  }

  constructor(
    private registroArmadioService: ArmadioService,
    private camereService: CamereService,
    private userService: AuthenticationService,
    private dipendentiService: DipendentiService
  ) {
    this.registroArmadioService.getRegistro()
      .pipe(
      map( (r: RegistroArmadio[]) =>
        r.map((x: RegistroArmadio) => {
        return {
            ...x,
          cameraInfo: x.cameraInfo[0],
          pazienteInfo: x.pazienteInfo[0],
        }
      }))
    ).subscribe((registro: RegistroArmadio[])=> {
      console.log(registro);

      this.registroArmadioDataSource = new MatTableDataSource<RegistroArmadio>(registro);
      this.registroArmadioDataSource.paginator = this.paginator;
    });
  }


}
