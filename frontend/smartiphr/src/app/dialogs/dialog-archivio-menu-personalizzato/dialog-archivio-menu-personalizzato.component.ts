import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CucinaMenuPersonalizzato } from 'src/app/models/CucinaMenuPersonalizzato';
import { MenuPersonalizzatiView } from 'src/app/models/MenuPersonalizzatoView';
import { Paziente } from 'src/app/models/paziente';
import { CucinaService } from 'src/app/service/cucina.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-dialog-archivio-menu-personalizzato',
  templateUrl: './dialog-archivio-menu-personalizzato.component.html',
  styleUrls: ['./dialog-archivio-menu-personalizzato.component.css']
})
export class DialogArchivioMenuPersonalizzatoComponent implements OnInit {

  idPaziente: string;
  paziente: Paziente;


  displayedColumns: string[] = [
    "data",
    "descrizione",
    "colazione",
    "pranzo",
    "cena"
  ];

  dataSourceArchivioPersonalizzato: MatTableDataSource<MenuPersonalizzatiView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<DialogArchivioMenuPersonalizzatoComponent>,
    private cucinaService: CucinaService,
    private pazientiService: PazienteService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      idPaziente: string
    }) {
    console.log("Open Dialog - Archivio Menu Personalizzato id paziente:", data.idPaziente);
    this.idPaziente = data.idPaziente;
  }

  ngOnInit(): void {

    from(this.pazientiService.getPaziente(this.idPaziente))
        .subscribe((paziente: Paziente)=> {
          const p = paziente[0];
          this.paziente = p;

          this.cucinaService.getByPaziente(this.idPaziente)
              .pipe(
                map((items: CucinaMenuPersonalizzato[]) =>
                  items.map(x=> {
                    return {
                      idPaziente: p._id,
                      nome: p.nome,
                      codiceFiscale: p.codiceFiscale,
                      cognome: p.cognome,
                      menuPersonalizzato: x
                    }
                  })
                ))
              .subscribe((items: MenuPersonalizzatiView[])=> {
                this.dataSourceArchivioPersonalizzato = new MatTableDataSource(items);
                this.dataSourceArchivioPersonalizzato.paginator = this.paginator;
              })
    });
  }
}
