import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Armadio } from 'src/app/models/armadio';
import { Paziente } from 'src/app/models/paziente';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
import { ArmadioService } from 'src/app/service/armadio.service';
import { ControlliOSS } from 'src/app/models/controlliOSS';
import { ControlliOSSService } from 'src/app/service/controlli-oss.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/models/user';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Camere } from 'src/app/models/camere';
import { map } from 'rxjs/operators';


export interface GroupBy {
  initial: string;
  isGroupBy: boolean;
}
@Component({
  selector: 'app-dialog-armadio',
  templateUrl: './dialog-armadio.component.html',
  styleUrls: ['./dialog-armadio.component.css']
})
export class DialogArmadioComponent implements OnInit {

  camera: Camere;

  displayedColumnsIndumenti: string[] = [
    "nome",
    "quantita",
    "note",
    "paziente"
  ];

  dataSourceIndumenti: MatTableDataSource<Armadio | GroupBy>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(
    public dialogRef: MatDialogRef<DialogArmadioComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public armadioService: ArmadioService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
    }) {
      this.camera = Camere.clone(data.camera);
      this.armadioService.getIndumenti(data.camera._id)
          .pipe(
            map((armadio: Armadio[])=>
              armadio.map((a: Armadio) => {
                return {
                  ...a,
                  indumento: {
                    ...a.indumento,
                    paziente: a.indumento.paziente[0]
                  }
                }
              })
            )
          )
          .subscribe((armadio: Armadio[])=> {
            const data: any[] = [];

            const dataSource: any[] = armadio.reduce((r, a) =>{
              r[a.indumento.idPaziente] = r[a.indumento.idPaziente] || [];
              r[a.indumento.idPaziente].push(a);
              return r;
            }, Object.create(null));


            Object.keys(dataSource)
                  .forEach((key, item) => {
                      data.push({initial: key, paziente: dataSource[key][0].indumento.paziente, isGroupBy: true });
                      dataSource[key].forEach(i=> data.push(i));
                  });
            console.log("Armadio:", data);

            this.dataSourceIndumenti = new MatTableDataSource<Armadio | GroupBy>(data);
            this.dataSourceIndumenti.paginator = this.paginator;
          });
    }

  ngOnInit() {
  }

  isGroup(index, item): boolean{
    return item.isGroupBy;
  }


  async save(model: Armadio) {
    console.log("Insert ElementoArmadio: ", model);
    // this.armadioService
    //   .insert(model)
    //   .then((result: Armadio) => {
    //     console.log("Insert ElementoArmadio: ", result);
    //     this.elementiArmadio.push(result);
    //     this.ElementiArmadioDataSource.data = this.elementiArmadio;
    //     this.addingElementoArmadio = false;
    //     this.uploadingElementoArmadio = false;
    //   })
    //   .catch((err) => {
    //     this.messageService.showMessageError("Errore Inserimento ElementoArmadio");
    //     console.error(err);
    //   });
  }

  async getElementi() {
    console.log(`Lista elementi:`);
    // this.armadioService
    //   .getElementiByPaziente(this.paziente._id)
    //   .then((f: Armadio[]) => {
    //     this.elementiArmadio = f;

    //     this.ElementiArmadioDataSource = new MatTableDataSource<Armadio>(
    //       this.elementiArmadio
    //     );
    //     this.ElementiArmadioDataSource.paginator = this.ElementoArmadioPaginator;
    //   })
    //   .catch((err) => {
    //     this.messageService.showMessageError(
    //       "Errore caricamento lista ElementiArmadio"
    //     );
    //     console.error(err);
    //   });
  }


}
