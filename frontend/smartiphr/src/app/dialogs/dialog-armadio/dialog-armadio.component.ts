import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Armadio } from 'src/app/models/armadio';
import { Paziente } from 'src/app/models/paziente';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { ArmadioService } from 'src/app/service/armadio.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Camere } from 'src/app/models/camere';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Indumento } from '../../models/indumento';
import { IndumentiComponent } from '../indumenti/indumenti.component';
import { DipendentiService } from '../../service/dipendenti.service';
import { Dipendenti } from '../../models/dipendenti';
import { DialogIndumentoComponent } from '../dialog-indumento/dialog-indumento.component';
import { DialogVerificaArmadioComponent } from '../dialog-verifica-armadio/dialog-verifica-armadio.component';


export interface Content {
  indumento: Indumento;
  paziente: Paziente;
}


@Component({
  selector: 'app-dialog-armadio',
  templateUrl: './dialog-armadio.component.html',
  styleUrls: ['./dialog-armadio.component.css']
})
export class DialogArmadioComponent implements OnInit {

  camera: Camere;
  paziente?: Paziente;
  currentArmadio: Armadio;

  // dataSourceIndumenti: MatTableDataSource<Armadio | GroupBy>;
  //dataSource: Observable<Content[]>;
  dataSource: MatTableDataSource<Indumento>;
  @ViewChild("Indumenti", { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'quantity', 'load', 'unload', 'notes', 'date', 'operator', 'action'];
  //dataSourceIndumentiByPatient: MatTableDataSource<Armadio>;
  currentMonth: moment.Moment = moment().locale("it");
  dataSourcePatients: Observable<Paziente[]>;

  statusCompleted: Number;
  verificato: boolean;
  lastusercheck: String;
  lastcheck: Date;
  dataSourceRequest: Observable<Armadio[]>;
  editEnable: Boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogArmadioComponent>,
    private pazienteService: PazienteService,
    public dialog: MatDialog,
    private armadioService: ArmadioService,
    private messageService: MessagesService,
    private dipendentiService: DipendentiService,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
      paziente: Paziente;
    }) {
    this.dataSource = new MatTableDataSource<Indumento>();
    this.currentArmadio = new Armadio();
    this.camera = data.camera;
    if (data.paziente != new Paziente()) {
      this.paziente = data.paziente;
    }
    this.editEnable = true;
    this.loadIndumenti();
    this.armadioService.getByPaziente(this.paziente._id)
      .then((result: Armadio) => {
        this.currentArmadio = result[0];
        this.dataSource.data = this.currentArmadio.contenuto.filter(x => {
          const dataCaricamento = moment(x.dataCaricamento); // Converti dataCaricamento in un oggetto moment
          return dataCaricamento.isSame(this.currentMonth, 'month'); // Confronta mese e anno
        });
        if (this.currentArmadio.verified) {
          this.verificato = true;
        }
        else {
          this.verificato = false;
        }
        this.dataSource.paginator = this.paginator;
        this.lastusercheck = this.currentArmadio.lastChecked.idUser;
        this.lastcheck = this.currentArmadio.lastChecked.datacheck;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento Armadio");
        console.error(err);
      });

  }

  ngOnInit() {
    this.editEnable = true;
    if (this.data.paziente != new Paziente()) {
      this.paziente = this.data.paziente;
    }
    console.log(this.paziente);

  }

  save(model: Armadio) {
    console.log("Insert ElementoArmadio: ", model);
  }

  carico(item: Content) {
    item.indumento.quantita = item.indumento.quantita + 1;
    this.updateIndumenti(item, "Carico indumenti");
  }

  scarico(item: Content) {
    if (item.indumento.quantita - 1 >= 0) {
      item.indumento.quantita = item.indumento.quantita - 1;
      this.updateIndumenti(item, "Scarico indumenti");
    }
  }

  updateIndumenti(item: Content, note: string) {
  }

  loadMonthlyData() {
    const currentDate = moment();

    const currentMonthStart = currentDate.clone().startOf('month');
    const nextMonthStart = currentMonthStart.clone().add(1, 'month');

    if (this.currentMonth.isSameOrAfter(currentMonthStart) && this.currentMonth.isBefore(nextMonthStart)) {
      this.editEnable = true;
    }
    else {
      this.editEnable = false;
    }
    this.dataSource.data = this.currentArmadio.contenuto.filter(x => {
      const dataCaricamento = moment(x.dataCaricamento); // Converti dataCaricamento in un oggetto moment
      return dataCaricamento.isSame(this.currentMonth, 'month'); // Confronta mese e anno
    });
    this.dataSource.paginator = this.paginator;
    this.lastusercheck = this.currentArmadio.lastChecked.idUser;
    this.lastcheck = this.currentArmadio.lastChecked.datacheck;
  }
  previousMonth() {
    this.currentMonth = moment(this.currentMonth)
      .add(-1, "M")
      .clone()
      .startOf("month");
    this.loadMonthlyData();
  }

  nextMonth() {
    this.currentMonth = moment(this.currentMonth)
      .add(1, "M")
      .clone()
      .startOf("month");
    this.loadMonthlyData();
  }


  details(row: Indumento) {
    console.log(row);
    var indumento: Indumento = new Indumento();
    const contenuto = this.currentArmadio.contenuto;
    for (var i: number = 0; i < contenuto.length; i++) {
      if (contenuto[i].nome == row.nome) {
        indumento = contenuto[i];
        break;
      }
    }
    if (indumento !== undefined) {
      var dialogRef = this.dialog.open(DialogIndumentoComponent, {
        data: {
          armadioData: this.currentArmadio,
          indumento: indumento
        },
        width: "600px",
        height: "450px"
      }).afterClosed()
        .subscribe(result => {
          this.dataSource.data = this.currentArmadio.contenuto.filter(x => {
            const dataCaricamento = moment(x.dataCaricamento); // Converti dataCaricamento in un oggetto moment
            return dataCaricamento.isSame(this.currentMonth, 'month'); // Confronta mese e anno
          });
          this.dataSource.paginator = this.paginator;
          this.dipendentiService.getById(this.currentArmadio.lastChecked.idUser).then((resulta: Dipendenti) => {
            this.lastusercheck = resulta.cognome + " " + resulta.nome;

          });
          this.lastcheck = this.currentArmadio.lastChecked.datacheck;
        });
    }
  }

  AddIndumento() {
    var dialogRef = this.dialog.open(IndumentiComponent, {
      data: {
        armadioData: this.currentArmadio,
        paziente: this.paziente
      },
      width: "1024px",
      height: "768px"
    }).afterClosed()
      .subscribe(result => {
        this.dataSource.data = this.currentArmadio.contenuto.filter(x => {
          const dataCaricamento = moment(x.dataCaricamento); // Converti dataCaricamento in un oggetto moment
          return dataCaricamento.isSame(this.currentMonth, 'month'); // Confronta mese e anno
        });
        this.dataSource.paginator = this.paginator;
        this.lastusercheck = this.currentArmadio.lastChecked.idUser;
        this.lastcheck = this.currentArmadio.lastChecked.datacheck;
      });

  }

  loadPatients() {

  }

  loadIndumenti() {

  }

  calculateRateVerifica() {

  }


  verifica() {
    var dialogRef = this.dialog.open(DialogVerificaArmadioComponent, {
      data: {
        armadio: this.currentArmadio,
      },
      width: "600px",
      height: "600px"
    }).afterClosed()
      .subscribe(
        (result) => {
          if (this.currentArmadio.verified) this.verificato = true;
        }
    );
  }


  changePatient(event: MatSelectChange) {
  }
}
