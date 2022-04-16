import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegistroSanificazione } from 'src/app/models/RegistroSanificazione';
import { SanificazioneService } from 'src/app/service/sanificazione.service';

@Component({
  selector: 'app-sanificazione-registro',
  templateUrl: './sanificazione-registro.component.html',
  styleUrls: ['./sanificazione-registro.component.css']
})
export class SanificazioneRegistroComponent implements OnInit {
  @ViewChild("paginatorControlliOSS",{static: false}) ControlliOSSPaginator: MatPaginator;

  public registroSanficazioneDataSource: MatTableDataSource<RegistroSanificazione>;
  DisplayedColumns: string[] = [
    "cameraId",
    "stato",
    "data",
    "note",
    "firma"
  ];

  registroSanficazione: Observable<RegistroSanificazione[]>;

  constructor(
    private sanficazioneService: SanificazioneService
  ) {

    this.registroSanficazione = this.sanficazioneService.getRegistro();
    this.registroSanficazione.pipe(
      map( (r: RegistroSanificazione[]) =>
      r.map((x: RegistroSanificazione)=> {
        return {
            ...x,
            cameraInfo: x.cameraInfo[0],
            userInfo: x.userInfo[0]
        }
      }))
    ).subscribe((registro: RegistroSanificazione[])=> {
      console.log(registro);

      this.registroSanficazioneDataSource = new MatTableDataSource<RegistroSanificazione>(registro);
    });

   }

  ngOnInit(): void {
  }

}
