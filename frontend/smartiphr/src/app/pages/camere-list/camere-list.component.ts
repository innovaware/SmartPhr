import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { Camere } from 'src/app/models/camere';
import { CamereService } from 'src/app/service/camere.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-camere-list',
  templateUrl: './camere-list.component.html',
  styleUrls: ['./camere-list.component.css']
})
export class CamereListComponent implements OnInit {
  piano: string = "2p";

  displayedColumns: string[] = [
    "camera",
    "piano",
    "numPostiLiberi",
    "numMaxPosti",
    "action",
  ];
  dataSourceCamere: MatTableDataSource<Camere>;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private camereService: CamereService,
    private messageService: MessagesService,
  ) { }

  ngOnInit(): void {
    console.log("INIT DataSource Camere");
    this.camereService.get(this.piano)
    .pipe(
      map( (x: Camere[])=>
          x.filter(c=> c.forPatient === true).sort((o1, o2)=> o1.order - o2.order)),
      map( (x: Camere[])=>
          x.map( c => {
            return {
              ...c,
              geometryObject: JSON.parse(c.geometry)
            };
          }))
    )
    .subscribe(
      (camere: Camere[]) => {
        this.dataSourceCamere = new MatTableDataSource<Camere>(camere);
        this.dataSourceCamere.paginator = this.paginator;
      },

      err => {
        console.error("Error loading camere: ", err);
        this.messageService.showMessageError("Errore nel recuperare lista delle camere");
      }
    );

  }

}
