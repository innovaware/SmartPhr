import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from } from 'rxjs';
import { DialogLavanderiaComponent } from 'src/app/dialogs/dialog-lavanderia/dialog-lavanderia.component';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Lavanderia, TypeOperationLavanderia } from 'src/app/models/lavanderia';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { LavanderiaService } from 'src/app/service/lavanderia.service';
import { MessagesService } from 'src/app/service/messages.service';

export class LavanderiaView {
  idDipendente: string;
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
    "operazione"
  ];

  dataSourceLavanderia: MatTableDataSource<LavanderiaView>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;



  constructor(
    private lavanderiaService: LavanderiaService,
    private dipendenteService: DipendentiService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private messageService: MessagesService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lavanderiaService.getAll()
        .subscribe((items: Lavanderia[]) => {
          const itemsView: LavanderiaView[] = [];
          items.forEach(element => {
            const idDipendente = element.idDipendente;
            from(this.dipendenteService.getById(idDipendente))
              .subscribe( (dipendente: Dipendenti) => {
                itemsView.push({
                  codiceFiscale: dipendente.cf,
                  cognome: dipendente.cognome,
                  nome: dipendente.nome,
                  idDipendente: idDipendente,
                  lavanderia: element
                });

                this.dataSourceLavanderia = new MatTableDataSource(
                  itemsView.sort(
                    (a, b) => new Date(a.lavanderia?.data).getTime() - new Date(b.lavanderia?.data).getTime()
                  )
                );
                this.dataSourceLavanderia.paginator = this.paginator;
              });


          });
        });
  }


  add(tipologia: TypeOperationLavanderia) {
    this.authenticationService.getCurrentUserAsync()
        .subscribe( (user) => {
          from(this.dipendenteService.getByIdUser(user._id))
              .subscribe( (dipendente: Dipendenti) => {

                var dialogRef = this.dialog.open(DialogLavanderiaComponent, {
                  width: "600px",
                  data: {
                    typeOperation: tipologia
                  }
                });

                if (dialogRef != undefined)
                  dialogRef.afterClosed()
                           .subscribe(
                              (result: {
                                note: string;
                                date: Date;
                              }) => {
                                  if(result != null && result != undefined){
                                    const lavanderia: Lavanderia = {
                                      data: result.date,
                                      descrizione: result.note,
                                      descrizioneTipologia: tipologia === TypeOperationLavanderia.LAVATRICE ? "Lavatrice" : "Asciugatrice",
                                      idDipendente: dipendente[0]._id,
                                      tipologia: tipologia
                                    }

                                    this.lavanderiaService.add(lavanderia)
                                    .subscribe( result => {
                                      console.log("Salvataggio eseguito con successo", result);
                                      this.messageService.showMessageError("Aggiornato correttamente");
                                      this.loadData();
                                    },
                                    err => {
                                      console.error("Errore inserimento", err);
                                      this.messageService.showMessageError("Errore Aggiornamento");
                                    });
                                  }
                              });
              });
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
