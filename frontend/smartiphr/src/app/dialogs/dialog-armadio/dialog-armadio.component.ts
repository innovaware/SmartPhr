import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Armadio, Contenuto, Indumento } from 'src/app/models/armadio';
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
import { count, filter, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { resourceLimits } from 'worker_threads';


export interface GroupBy {
  initial: string;
  isGroupBy: boolean;
  paziente: Paziente;
}


@Component({
  selector: 'app-dialog-armadio',
  templateUrl: './dialog-armadio.component.html',
  styleUrls: ['./dialog-armadio.component.css']
})
export class DialogArmadioComponent implements OnInit {

  camera: Camere;
  selectedPatient?: Paziente;

  displayedColumnsIndumenti: string[] = [
    "nome",
    "quantita",
    "note",
  ];

  displayedColumnsIndumentiByPatient: string[] = [
    "nome",
    "quantita",
    "note",
  ];

  currentArmadio: Armadio;

  // dataSourceIndumenti: MatTableDataSource<Armadio | GroupBy>;
  dataSourceIndumenti: Observable<(Indumento | GroupBy)[]>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  //dataSourceIndumentiByPatient: MatTableDataSource<Armadio>;
  dataSourceIndumentiByPatient: Observable<Indumento[]>;

  dataSourcePatients: Observable<Paziente[]>;

  statusCompleted: Number;

  dataSourceRequest: Observable<Armadio[]>;

  constructor(
    public dialogRef: MatDialogRef<DialogArmadioComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public armadioService: ArmadioService,
    public messageService: MessagesService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
    }) {
      this.camera = data.camera;
      this.dataSourceRequest = this.armadioService.getIndumenti(this.camera._id, new Date());
      this.dataSourceRequest.subscribe(a=> {
        this.currentArmadio = a[0]
        if (this.currentArmadio !== undefined) {
          this.currentArmadio.rateVerifica = 0;
          this.calculateRateVerifica();
        }
      });

      this.loadPatients();
      this.loadIndumenti();

    }

  ngOnInit() {
  }

  isGroup(index, item): boolean{
    return item.isGroupBy;
  }


  save(model: Armadio) {
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

  loadPatients() {
    this.dataSourcePatients = this.dataSourceRequest.pipe(
      map((armadio: Armadio[])=> {

        const items = armadio.flatMap(a => a.contenuto.map(c=> {
          return {
            idPaziente: c.idPaziente,
            verificato: c.verificato
          }
        })).filter( a=> !a.verificato)

        return armadio.flatMap(p=> p.pazienti).filter(p=> items.findIndex(i=> i.idPaziente === p._id) >= 0);
      })
    );
  }

  loadIndumenti() {
    this.dataSourceIndumenti = this.dataSourceRequest.pipe(
      map((armadio: Armadio[])=>
        armadio.map(a=> {
          return {
              ...a,
              contenuto: a.contenuto.map( c=>
              {
                  return {
                      ...c,
                      paziente: a.pazienti.find(p=> p._id === c.idPaziente)
                  }
              })
          }
        })
      ),
      map((armadi: Armadio[])=> {
          const data: (Indumento | GroupBy)[] = [];
          if (armadi.length === 0) return data;

          const armadio = armadi[0];
          armadio.contenuto.forEach(c=>{
            const group: GroupBy = {
              initial: c.idPaziente,
              isGroupBy: true,
              paziente: c.paziente
            };
            data.push(group);
            c.items.forEach(i=> data.push(i));
          });
          return data;
      })
    );
  }

  calculateRateVerifica() {
    this.dataSourceRequest.subscribe( armadio => {
      const countPatients = armadio.flatMap(a=> a.pazienti).length;

      if (countPatients !== 0) {
        this.currentArmadio.rateVerifica =  ( this.currentArmadio.contenuto.filter(c=> c.verificato).length / countPatients) * 100;
      }
    })
  }


  async verifica() {
    this.dataSourceRequest.subscribe( armadio => {
      const countPatients = armadio.flatMap(a=> a.pazienti).length;

      const contenutoByPatient = this.currentArmadio.contenuto.filter(contenuto=> contenuto.idPaziente === this.selectedPatient?._id);
      if (contenutoByPatient.length > 0) {
        contenutoByPatient[0].verificato = true;
      }

      this.currentArmadio.lastChecked = {
        idUser: this.authenticationService.getCurrentUser()._id,
        data: new Date()
      };

      if (countPatients !== 0) {
        this.currentArmadio.rateVerifica =  ( this.currentArmadio.contenuto.filter(c=> c.verificato).length / countPatients) * 100;
      }

      this.armadioService.update(this.currentArmadio).subscribe(a => {
        console.log("Update completed: ", a);

        this.loadPatients();
        this.dataSourceIndumentiByPatient = of([]);

        this.calculateRateVerifica();
      });
    });
  }

  changePatient(event: MatSelectChange) {
    const patient: Paziente = event.value as Paziente;

    this.dataSourceIndumentiByPatient = this.dataSourceRequest.pipe(
      map((armadi: Armadio[])=> {
        if (armadi.length === 0) return [];
        const armadio = armadi[0];

        return armadio.contenuto.filter(i=> i.idPaziente === patient._id)
      }),
      map( (contenuto: Contenuto[]) => {
        const result: Indumento[] = contenuto.flatMap(i=> i.items);
        return result;
      }));
  }
}
