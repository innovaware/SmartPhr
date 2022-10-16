import { Component, OnInit, ViewChild } from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogLavanderiaComponent } from 'src/app/dialogs/dialog-lavanderia/dialog-lavanderia.component';
import { Lavanderia } from 'src/app/models/lavanderia';
import { Paziente } from 'src/app/models/paziente';
import { LavanderiaService } from 'src/app/service/lavanderia.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

export class LavanderiaView {
  idPaziente: string;
  cognome: string;
  nome: string;
  codiceFiscale: string;
  lavanderia: Lavanderia;
}

@Component({
  selector: 'app-lavanderia',
  templateUrl: './lavanderia.component.html',
  styleUrls: ['./lavanderia.component.css']
})
export class LavanderiaComponent implements OnInit {

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "data",
    "descrizione",
    "action",
  ];

  dataSourceLavanderia: MatTableDataSource<LavanderiaView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;



  constructor(
    private lavanderiaService: LavanderiaService,
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
              lavanderia: undefined
            }
          });
        }),
        map( (it: LavanderiaView[])=> {

          this.lavanderiaService.getAll()
              .subscribe((items: Lavanderia[])=> {
                it.forEach(i=> {
                  return {
                    ...i,
                    lavanderia: items
                                  .sort((a: Lavanderia, b: Lavanderia) => <any>a.data - <any>b.data)
                                  .find(x=> x.idPaziente === i.idPaziente)
                  }
                });
          })

          return it;
        })
      )
      .subscribe(
        (items: LavanderiaView[]) => {
          this.lavanderiaService.getAll()
              .subscribe((lavs: Lavanderia[])=> {
                lavs.forEach(i=> {
                  const itemView = items.find(x=> x.idPaziente === i.idPaziente);
                  itemView.lavanderia = i;
                });

                this.dataSourceLavanderia = new MatTableDataSource(items);
                this.dataSourceLavanderia.paginator = this.paginator;
              });
        }
      )


  }


  add(element: LavanderiaView, tipologia: Number) {
    var dialogRef = this.dialog.open(DialogLavanderiaComponent, {
      width: "600px",
      data: {
        paziente: {
          nome: element.nome,
          cognome: element.cognome,
          codiceFiscale: element.codiceFiscale
        }
      }
    });


    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((
        result: {
          note: string;
          date: Date;
        }) => {
        if(result != null && result != undefined){
          const lavanderia: Lavanderia = {
            data: result.date,
            descrizione: result.note,
            descrizioneTipologia: tipologia === 1 ? "Lavatrice" : "Asciugatrice",
            idPaziente: element.idPaziente,
            tipologia: tipologia
          }

          this.lavanderiaService.add(lavanderia)
              .subscribe( result => {
                  console.log("Salvataggio eseguito con successo", result);
                  this.messageService.showMessageError("Aggiornato correttamente");
                  element.lavanderia.data = result.data;
                  element.lavanderia.descrizioneTipologia = result.descrizioneTipologia;
                  element.lavanderia.descrizione = result.descrizione;
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
    this.dataSourceLavanderia.filter = filterValue.trim().toLowerCase();
  }

  cleanSearchField() {
    this.dataSourceLavanderia.filter = undefined;
  }
}
