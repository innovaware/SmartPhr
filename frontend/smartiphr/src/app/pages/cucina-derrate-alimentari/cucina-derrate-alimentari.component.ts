import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { DialogCucinaDerranteAlimentiCaricoComponent } from 'src/app/dialogs/dialog-cucina-derrante-alimenti-carico/dialog-cucina-derrante-alimenti-carico.component';
import { DialogCucinaDerranteAlimentiComponent } from 'src/app/dialogs/dialog-cucina-derrante-alimenti/dialog-cucina-derrante-alimenti.component';
import { CucinaDerrateAlimenti } from 'src/app/models/CucinaDerrateAlimenti';
import { CucinaDerrateAlimentiStorico } from 'src/app/models/CucinaDerrateAlimentiStorico';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UsersService } from 'src/app/service/users.service';

export class CucinaAmbientiStoricoView extends CucinaDerrateAlimentiStorico {
  user: User
}

@Component({
  selector: 'app-cucina-derrate-alimentari',
  templateUrl: './cucina-derrate-alimentari.component.html',
  styleUrls: ['./cucina-derrate-alimentari.component.css']
})
export class CucinaDerrateAlimentariComponent implements OnInit {

  derrantiAlimenti: CucinaDerrateAlimenti[];
  public derrantiAlimentiDataSource: MatTableDataSource<CucinaDerrateAlimenti>;
  @ViewChild("paginatorDerranteAlimenti", {static: false})  paginatorDerranteAlimenti: MatPaginator;
  derrantiAlimentiDisplayedColumns: string[] = ["nome", "dateInsert", "quantita", "note", "action"];

  public derrantiAlimentiStoricoDataSource: MatTableDataSource<CucinaAmbientiStoricoView>;
  @ViewChild("paginatorDerranteAlimentiStorico", {static: false})  paginatorDerranteAlimentiStorico: MatPaginator;
  derrantiAlimentiStoricoDisplayedColumns: string[] = ["nome", "dateInsert", "quantita", "note", "operazione", "user"];


  constructor(
    private cucinaService: CucinaService,
    private dialog: MatDialog,
    private messageService: MessagesService,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.cucinaService.getDerranteAlimenti()
        .subscribe( (derrantiAlimenti: CucinaDerrateAlimenti[])=> {
            this.derrantiAlimenti = derrantiAlimenti;
            this.derrantiAlimentiDataSource = new MatTableDataSource<CucinaDerrateAlimenti>(this.derrantiAlimenti);
            this.derrantiAlimentiDataSource.paginator = this.paginatorDerranteAlimenti;
        });

    this.cucinaService.getDerranteAlimentiArchivio()
        .subscribe((derrantiAlimenti: CucinaDerrateAlimentiStorico[])=> {
            const derrantiView: CucinaAmbientiStoricoView[] = [];
            derrantiAlimenti.forEach(element => {
              from(this.userService.getById(element.idUser)).subscribe( user=>  {
                derrantiView.push({
                  ...element,
                  user
                });

                this.derrantiAlimentiStoricoDataSource = new MatTableDataSource<CucinaAmbientiStoricoView>(derrantiView);
                this.derrantiAlimentiStoricoDataSource.paginator = this.paginatorDerranteAlimentiStorico;
              });
            });

            console.log(derrantiView);


        });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.derrantiAlimentiDataSource.filter = filterValue.trim().toLowerCase();
  }

  AddAlimento() {
    this.dialog
      .open(DialogCucinaDerranteAlimentiComponent, {
        data: new CucinaDerrateAlimenti(),
        width: `${window.screen.width}px`,
      })
      .afterClosed()
      .subscribe((result: CucinaDerrateAlimenti) => {
        if (result) {
          this.authenticationService.getCurrentUserAsync()
              .subscribe(
                (user)=>{
                  result.idUser = user._id;
                  this.cucinaService.addDerranteAlimenti(result)
                      .subscribe( resultDerranteInsert => {
                        this.messageService.showMessage(`Inserimento eseguito`);
                        this.load();
                      },
                      err=> {
                        console.log(err);
                        this.messageService.showMessageError(`Errore inserimento derrante`);
                      });
          });
        }
      });
  }

  modify(derranteAlimenti: CucinaDerrateAlimenti) {
    this.dialog
      .open(DialogCucinaDerranteAlimentiComponent, {
        data: CucinaDerrateAlimenti.clone(derranteAlimenti),
        width: `${window.screen.width}px`,
      })
      .afterClosed()
      .subscribe((result: CucinaDerrateAlimenti) => {
        if (result) {
          this.authenticationService.getCurrentUserAsync()
              .subscribe(
                (user)=>{
                  result.idUser = user._id;
                  this.cucinaService.updateDerranteAlimenti(result)
                      .subscribe( resultDerranteInsert => {
                        this.messageService.showMessage(`Modifica eseguita`);
                        this.load();
                      },
                      err=> {
                        console.log(err);
                        this.messageService.showMessageError(`Errore modifica derrante`);
                      });
          });
        }
      });
  }

  carico(derranteAlimenti: CucinaDerrateAlimenti) {
    this.dialog
      .open(DialogCucinaDerranteAlimentiCaricoComponent, {
        data: CucinaDerrateAlimenti.clone(derranteAlimenti),
        width: `${window.screen.width}px`,
      })
      .afterClosed()
      .subscribe((result: CucinaDerrateAlimenti) => {
        if (result) {
          this.authenticationService.getCurrentUserAsync()
              .subscribe(
                (user)=>{
                  result.idUser = user._id;
                  this.cucinaService.updateDerranteAlimenti(result)
                      .subscribe( resultDerranteInsert => {
                        this.messageService.showMessage(`Operazione eseguita`);
                        this.load();
                      },
                      err=> {
                        console.log(err);
                        this.messageService.showMessageError(`Errore in fase di carico o scarico`);
                      });
          });
        }
      });
  }

}
