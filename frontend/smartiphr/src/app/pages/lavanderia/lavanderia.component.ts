import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lavanderia } from 'src/app/models/lavanderia';
import { Paziente } from 'src/app/models/paziente';
import { LavanderiaService } from 'src/app/service/lavanderia.service';
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
  ) { }

  ngOnInit(): void {

    //this.lavanderiaService.add({
    //  data: new Date(),
    //  descrizione: "test",
    //  descrizioneTipologia: "test",
    //  idPaziente: "6172d8631340fec684deea28",
    //  tipologia: 0
    //}).subscribe();

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
          console.log("Items", items);

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


    //this.lavanderiaService.getAll()
    //    .pipe(
    //      map((items: Lavanderia[])=> {
    //        const results: LavanderiaView[] = [];

    //        items.forEach(x=> {
    //          this.pazientiService.getPaziente(x.idPaziente)
    //              .then(p=> {
    //                  results.push({
    //                    codiceFiscale: p.codiceFiscale,
    //                    nome: p.nome,
    //                    cognome: p.cognome,
    //                    lavanderia: x
    //                  })
    //              });
    //        });
    //        return results;
    //      })
    //    )
    //    .subscribe(
    //      (items: LavanderiaView[]) => {
    //        console.log("Items", items);
    //        this.dataSourceLavanderia = new MatTableDataSource(items);
    //        this.dataSourceLavanderia.paginator = this.paginator;
    //      }
    //    )
  }

}
