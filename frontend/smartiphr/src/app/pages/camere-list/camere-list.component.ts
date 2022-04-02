import { Component, OnInit, ViewChild, ɵɵqueryRefresh } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { CamereDetailsComponent } from 'src/app/dialogs/camere-details/camere-details.component';
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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(
    private camereService: CamereService,
    private messageService: MessagesService,
    public dialogCamera: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log("INIT DataSource Camere");
    this.refresh();
  }

  refresh() {
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

  viewCamera(camera: Camere) {
    this.dialogCamera.open(CamereDetailsComponent, {
      data: {
        camera: camera,
        editMode: false
      },
      width: "600px",
    })
    .afterClosed();
  }

  editCamera(camera: Camere) {
    const cameraEdit: Camere = Camere.clone(camera);

    this.dialogCamera.open(CamereDetailsComponent, {
      data: {
        camera: cameraEdit,
        editMode: true
      },
      //disableClose: true,
      width: "600px",
    })
    .afterClosed()
    .subscribe( result => {
      //console.log("Closed Camera Dialog: ", result);
        if (result) {
          Camere.copy(cameraEdit, camera)

          this.camereService.update(cameraEdit)
          .subscribe( result => {
            console.log("Aggiornamento camera eseguito con successo");
            //this.messageService.showMessageError("Camera aggiornata con successo");
          });
        }
        this.refresh();

    })
  }

}
