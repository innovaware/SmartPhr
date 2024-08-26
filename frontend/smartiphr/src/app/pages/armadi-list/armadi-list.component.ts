import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DialogArmadioComponent } from 'src/app/dialogs/dialog-armadio/dialog-armadio.component';
import { Camere } from 'src/app/models/camere';
import { User } from 'src/app/models/user';
import { CamereService } from 'src/app/service/camere.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UsersService } from 'src/app/service/users.service';
import { ArmadioService } from '../../service/armadio.service';
import { PazienteService } from '../../service/paziente.service';
import { Paziente } from '../../models/paziente';
import { Observable } from 'rxjs';
import { Armadio } from '../../models/armadio';
import { itemDialog } from '../../models/itemDialog';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';


@Component({
  selector: 'app-armadi-list',
  templateUrl: './armadi-list.component.html',
  styleUrls: ['./armadi-list.component.css']
})
export class ArmadiListComponent implements OnInit {
  piano: string = "2p";

  displayedColumns: string[] = [
    "paziente",
    "camera",
    "armadio",
    "armadioCheck",
    "dataArmadioCheck",
    "firmaArmadio",
    "action",
  ];


  itemDialog: itemDialog[];
  dataSource: MatTableDataSource<itemDialog>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pazienti: Paziente[];
  paziente: Paziente;
  camere: Camere[];
  armadioCheck: boolean;
  dataCheck: Date;
  userCheck: String;
  constructor(
    public dialog: MatDialog,
    private camereService: CamereService,
    private armadioService: ArmadioService,
    private pazienteService: PazienteService,
    private messageService: MessagesService,
    private dipendentiService: DipendentiService
  ) {
    this.dataSource = new MatTableDataSource<itemDialog>();
  }

  ngOnInit(): void {
    this.itemDialog = []
    this.refresh();
  }

  refresh() {
    this.itemDialog = [];
    this.pazienteService.getPazienti().then((result: Paziente[]) => {
      const pazientiConCamera = result.filter(x => x.idCamera !== undefined && x.idCamera !== null);

      const promises = pazientiConCamera.map((p: Paziente) => {
        const item = new itemDialog();
        item.paziente = p;

        return this.armadioService.getByPaziente(p._id).then((resulta: Armadio) => {
          item.armadio = resulta;
          item.verified = resulta[0].verified;
          item.datacheck = resulta[0].lastChecked.datacheck;
          item.Firmacheck = resulta[0].lastChecked.idUser;
          console.log("item.armadio: ",item.armadio[0]);
          //item.datacheck = ;
          return this.camereService.get(p.idCamera).toPromise().then((resulto: Camere) => {
            item.camera = resulto;
            this.itemDialog.push(item);
          });
        });
      });
      console.log(this.itemDialog);
      Promise.all(promises).then(() => {
        this.dataSource.data = this.itemDialog.sort((a, b) => new Date(b.datacheck).getTime() - new Date(a.datacheck).getTime());
        this.dataSource.paginator = this.paginator;
      }).catch(error => {
        console.error('Errore durante il caricamento dei dati:', error);
      });
    }).catch(error => {
      console.error('Errore durante il recupero dei pazienti:', error);
    });
  }


  verifica(item: itemDialog) {
    this.dialog.open(DialogArmadioComponent, {
      data: {
        camera: item.camera,
        paziente: item.paziente
      },
      width: "1024px",
      height: "800px"
    }).afterClosed().subscribe(
      result => {
        this.refresh();
      });
  }
}
