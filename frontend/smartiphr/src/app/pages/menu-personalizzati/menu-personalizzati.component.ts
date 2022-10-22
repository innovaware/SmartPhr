import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogMenuPersonalizzatoComponent } from 'src/app/dialogs/dialog-menu-personalizzato/dialog-menu-personalizzato.component';
import { CucinaMenuPersonalizzato } from 'src/app/models/CucinaMenuPersonalizzato';
import { Paziente } from 'src/app/models/paziente';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

export class MenuPersonalizzatiView {
  idPaziente: string;
  cognome: string;
  nome: string;
  codiceFiscale: string;
  menuPersonalizzato: CucinaMenuPersonalizzato;
}

@Component({
  selector: 'app-menu-personalizzati',
  templateUrl: './menu-personalizzati.component.html',
  styleUrls: ['./menu-personalizzati.component.css']
})
export class MenuPersonalizzatiComponent implements OnInit {

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "data",
    "descrizione",
    "action",
  ];

  dataSourceCucinaPersonalizzato: MatTableDataSource<MenuPersonalizzatiView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private cucinaService: CucinaService,
    private pazientiService: PazienteService,
    private dialog: MatDialog,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    from(this.pazientiService.getPazienti())
      .pipe(
        map((pazienti: Paziente[])=> {
          return pazienti.map(p => {
            return {
              idPaziente: p._id,
              nome: p.nome,
              codiceFiscale: p.codiceFiscale,
              cognome: p.cognome,
              menuPersonalizzato: undefined
            }
          });
        }),
        map( (it: MenuPersonalizzatiView[])=> {

          this.cucinaService.getAll()
              .subscribe((items: CucinaMenuPersonalizzato[])=> {
                it.forEach(i=> {
                  return {
                    ...i,
                    menuPersonalizzato: items
                                  .sort((a: CucinaMenuPersonalizzato, b: CucinaMenuPersonalizzato) => <any>a.data - <any>b.data)
                                  .find(x=> x.idPaziente === i.idPaziente)
                  }
                });
          })

          return it;
        })
      )
      .subscribe(
        (items: MenuPersonalizzatiView[]) => {
          this.cucinaService.getAll()
              .subscribe((lavs: CucinaMenuPersonalizzato[])=> {
                lavs.forEach(i=> {
                  const itemView = items.find(x=> x.idPaziente === i.idPaziente);
                  itemView.menuPersonalizzato = i;
                });

                this.dataSourceCucinaPersonalizzato= new MatTableDataSource(items);
                this.dataSourceCucinaPersonalizzato.paginator = this.paginator;
              });
        }
      )


  }


  add(element: MenuPersonalizzatiView) {
    var dialogRef = this.dialog.open(DialogMenuPersonalizzatoComponent, {
      width: "600px",
      data: {
        paziente: {
          nome: element.nome,
          cognome: element.cognome,
          codiceFiscale: element.codiceFiscale,
          menuPersonalizzato: element.menuPersonalizzato
        }
      }
    });


    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((
        result: {
          note: string;
          date: Date;
          colazione: string;
          pranzo: string;
          cena: string;
        }) => {
        if(result != null && result != undefined){
          const cucinaMenuPersonalizzato: CucinaMenuPersonalizzato = {
            data: result.date,
            descrizione: result.note,
            idPaziente: element.idPaziente,
            menuCena: result.cena,
            menuColazione: result.colazione,
            menuPranzo: result.pranzo
          }

          this.cucinaService.add(cucinaMenuPersonalizzato)
              .subscribe( result => {
                  console.log("Salvataggio eseguito con successo", result);
                  this.messageService.showMessageError("Aggiornato correttamente");
                  if (!element.menuPersonalizzato) {
                      element.menuPersonalizzato = {
                        data: result.data,
                        descrizione: result.descrizione,
                        idPaziente: element.idPaziente,
                        menuCena: result.menuCena,
                        menuColazione: result.menuColazione,
                        menuPranzo:result.menuPranzo
                      }
                  } else {
                    element.menuPersonalizzato.data = result.data;
                    element.menuPersonalizzato.descrizione = result.descrizione;
                    element.menuPersonalizzato.menuColazione = result.menuColazione;
                    element.menuPersonalizzato.menuPranzo = result.menuPranzo;
                    element.menuPersonalizzato.menuCena = result.menuCena;
                  }
              },
              err => {
                console.error("Errore inserimento", err);
                this.messageService.showMessageError("Errore Aggiornamento");
              });
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCucinaPersonalizzato.filter = filterValue.trim().toLowerCase();
  }

  cleanSearchField() {
    this.dataSourceCucinaPersonalizzato.filter = undefined;
  }
}

