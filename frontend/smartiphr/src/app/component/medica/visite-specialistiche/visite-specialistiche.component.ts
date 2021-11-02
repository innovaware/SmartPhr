import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogDiarioClinicoComponent } from 'src/app/dialogs/dialog-diario-clinico/dialog-diario-clinico.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogVisitespecialisticheComponent } from 'src/app/dialogs/dialog-visitespecialistiche/dialog-visitespecialistiche.component';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { DiarioClinico } from 'src/app/models/diarioClinico';
import { Paziente } from 'src/app/models/paziente';
import { VisiteSpecialistiche } from 'src/app/models/visiteSpecialistiche';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';

@Component({
  selector: 'app-visite-specialistiche',
  templateUrl: './visite-specialistiche.component.html',
  styleUrls: ['./visite-specialistiche.component.css']
})
export class VisiteSpecialisticheComponent implements OnInit {
  @Input() data: Paziente;
  public visiteSpecialistiche : any[] = [];

  displayedColumns: string[] = ['dataReq', 'contenuto' ,'dataEsec', 'action'];


  @ViewChild("paginatorVisiteSpecialistiche", { static: false }) visiteSpecialistichePaginator: MatPaginator;
  public visiteSpecialisticheDataSource: MatTableDataSource<VisiteSpecialistiche>;

  constructor(public dialogRef: MatDialogRef<VisiteSpecialisticheComponent>,
    public cartellaclinicaService: CartellaclinicaService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.getList();
  }


  async getList() {
    console.log(`get visite paziente: ${this.data._id}`);
    this.cartellaclinicaService
      .getVisiteByUser( String(this.data._id) )
      .then((f) => {
        console.log(JSON.stringify(f));

        this.visiteSpecialistiche = f;
        this.visiteSpecialisticheDataSource = new MatTableDataSource<VisiteSpecialistiche>(this.visiteSpecialistiche);
        this.visiteSpecialisticheDataSource.paginator = this.visiteSpecialistichePaginator;
  
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento visite");
        console.error(err);
      });
  }



  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
  }



  async add() {

    console.log("Show Add visita:", this.data);
    var dialogRef = this.dialog.open(DialogVisitespecialisticheComponent, {
      data: { paziente: this.data, readonly: false },
      width: "600px",
    });

    if (dialogRef != undefined)
    dialogRef.afterClosed().subscribe((result) => {
      if(result != null && result != undefined){
      this.visiteSpecialistiche.push(result);
      this.visiteSpecialisticheDataSource = new MatTableDataSource<VisiteSpecialistiche>(this.visiteSpecialistiche);
      }
    });
  }

}


