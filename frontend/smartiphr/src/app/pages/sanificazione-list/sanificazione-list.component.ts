import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Camere } from 'src/app/models/camere';
import { User } from 'src/app/models/user';
import { CamereService } from 'src/app/service/camere.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-sanificazione-list',
  templateUrl: './sanificazione-list.component.html',
  styleUrls: ['./sanificazione-list.component.css']
})
export class SanificazioneListComponent implements OnInit {
  piano: string = "2p";

  displayedColumns: string[] = [
    "camera",
    "sanificata",
    "dataSanificazione",
    "firmaSanificazione",
    "action",
  ];
  dataSourceCamere: MatTableDataSource<Camere>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private camereService: CamereService,
    private messageService: MessagesService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    console.log("INIT DataSource Camere");
    this.refresh();
  }

  refresh() {
    this.camereService.getByPiano(this.piano)
    .pipe(
      map( (x: Camere[])=>
          x.filter(c=> c.forPatient === true).sort((o1, o2)=> o1.order - o2.order)),
      map( (x: Camere[])=>
          x.map( c => {
            return {
              ...c,
              geometryObject: JSON.parse(c.geometry)
            };
          })),
    )
    .subscribe(
      (camere: Camere[]) => {
        camere.forEach(async (c: Camere)=> {
          if (c.firmaSanificazione !== undefined) {
            c.userSanificazione = await this.userService.getById(c.firmaSanificazione);
          }
        });

        this.dataSourceCamere = new MatTableDataSource<Camere>(camere);
        this.dataSourceCamere.paginator = this.paginator;
      },

      err => {
        console.error("Error loading camere: ", err);
        this.messageService.showMessageError("Errore nel recuperare lista delle camere");
      }
    );

  }

  sanifica(camera: Camere) {
    this.messageService.deleteMessageQuestion('Sanificare Camera')
        .subscribe( success => {
          if (success == true) {

            camera.sanificata = true;
            camera.dataSanificazione = new Date();
            camera.userSanificazione = JSON.parse(localStorage.getItem('currentUser')) as User;
            camera.firmaSanificazione = camera.userSanificazione._id;

            console.log("Sanifica camera: ", camera);
            this.camereService.update(camera).subscribe( c=> {
              console.log("Camera sanificata");
              this.refresh();
            });
          }
        });


  }

}
