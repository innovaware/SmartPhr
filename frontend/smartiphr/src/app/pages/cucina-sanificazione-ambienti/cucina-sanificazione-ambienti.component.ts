import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogQuestionComponent } from 'src/app/dialogs/dialog-question/dialog-question.component';
import { CucinaAmbienti } from 'src/app/models/CucinaAmbienti';
import { CucinaAmbientiArchivio } from 'src/app/models/CucinaAmbientiArchivio';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CucinaAmbientiService } from 'src/app/service/cucinaAmbienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UsersService } from 'src/app/service/users.service';

export class CucinaAmbientiView extends CucinaAmbienti {
  user: User;
}

export class CucinaAmbientiArchivioView extends CucinaAmbientiView {}

@Component({
  selector: 'app-cucina-sanificazione-ambienti',
  templateUrl: './cucina-sanificazione-ambienti.component.html',
  styleUrls: ['./cucina-sanificazione-ambienti.component.css']
})
export class CucinaSanificazioneAmbientiComponent implements OnInit {
  displayedColumns: string[] = [
    "nome",
    "dateSanificazioneOrdinaria",
    "dateSanificazioneStraordinaria",
    "idUser",
    "action",
  ];

  displayedColumnsArchivio: string[] = [
    "nome",
    "dateSanificazioneOrdinaria",
    "dateSanificazioneStraordinaria",
    "idUser"
  ];

  cucinaAmbienti: CucinaAmbientiView[];
  cucinaAmbientiArchivio: CucinaAmbientiArchivioView[];

  dataSource: MatTableDataSource<CucinaAmbientiView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  dataSourceArchivio: MatTableDataSource<CucinaAmbientiArchivio>;
  @ViewChild("paginatorArchivio", {static: false}) paginatorArchivio: MatPaginator;

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private messageService: MessagesService,
    private cucinaAmbientiService: CucinaAmbientiService
  ) {
    this.refreshData();
    this.refreshArchivio();
  }

  refreshData() {
    this.cucinaAmbientiService.getAll()
        .subscribe( (cucinaAmbienti: CucinaAmbienti[])=> {
          //this.cucinaAmbienti = cucinaAmbienti;
          this.cucinaAmbienti = [];

          cucinaAmbienti.forEach(async item => {
            this.cucinaAmbienti.push({
              ...item,
              user: await this.userService.getById(item.idUser)
            });

            this.dataSource = new MatTableDataSource<CucinaAmbientiView>(this.cucinaAmbienti);
            this.dataSource.paginator = this.paginator;
          });
        });
  }

  refreshArchivio() {
    this.cucinaAmbientiService.getAllArchivio()
        .subscribe( (cucinaAmbientiArchivio: CucinaAmbientiArchivio[])=> {
          //this.cucinaAmbienti = cucinaAmbienti;
          this.cucinaAmbientiArchivio = [];

          cucinaAmbientiArchivio.forEach(async item => {
            this.cucinaAmbientiArchivio.push({
              ...item,
              user: await this.userService.getById(item.idUser)
            });

            this.dataSourceArchivio = new MatTableDataSource<CucinaAmbientiArchivioView>(this.cucinaAmbientiArchivio);
            this.dataSourceArchivio.paginator = this.paginatorArchivio;
          });
        });
  }

  ngOnInit(): void {
  }

  sanificaOrdinaria(item: CucinaAmbienti) {
    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Eseguire Sanificazione Ordinaria ?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          item.dateSanficazioneOrdinaria = new Date();
          this.authenticationService.getCurrentUserAsync()
              .subscribe(
                (user)=>{
                  item.idUser = user._id;
                  this.cucinaAmbientiService.update(item)
                      .subscribe( result => {
                        this.messageService.showMessage(`Sanificazione Ordinaria. Ambiente ${item.nome} eseguita`);
                        this.refreshArchivio();
                      },
                      err=> {
                        console.log(err);
                        this.messageService.showMessageError(`Errore sanificazione ambiente ${item.nome}`);
                      });
          });
        }
      });
  }

  sanificaStraordinaria(item: CucinaAmbienti) {
    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Eseguire Sanificazione Straordinaria ?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          item.dateSanficazioneStraordinaria = new Date();
          this.authenticationService.getCurrentUserAsync()
              .subscribe(
                (user)=>{
                  item.idUser = user._id;
                  this.cucinaAmbientiService.update(item)
                      .subscribe( result => {
                        this.messageService.showMessage(`Sanificazione Straordinaria. Ambiente ${item.nome} eseguita`);
                        this.refreshArchivio();
                      },
                      err=> {
                        console.log(err);
                        this.messageService.showMessageError(`Errore sanificazione ambiente ${item.nome}`);
                      });
          });
        }
      });
  }

}
