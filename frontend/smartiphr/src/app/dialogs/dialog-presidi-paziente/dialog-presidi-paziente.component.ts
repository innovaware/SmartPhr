import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Presidi } from "src/app/models/presidi";
import { Paziente } from "src/app/models/paziente";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestPresidiService } from "src/app/service/gest-presidi.service";
import { MessagesService } from "src/app/service/messages.service";
import { DialogFarmacoPazienteComponent } from "../dialog-farmaco-paziente/dialog-farmaco-paziente.component";
import { DialogPresidioPazienteComponent } from "../dialog-presidio-paziente/dialog-presidio-paziente.component";



@Component({
  selector: 'app-dialog-presidi-paziente',
  templateUrl: './dialog-presidi-paziente.component.html',
  styleUrls: ['./dialog-presidi-paziente.component.css']
})
export class DialogPresidiPazienteComponent implements OnInit {

  displayedColumns: string[] = [
    "nome",
    "descrizione",
    "qty",
    "taglia",
    "action",
  ];
  dataSource: MatTableDataSource<Presidi>;
  presidi: Presidi[];
  allPresidi: Presidi[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor( public dialog: MatDialog,
    public presidiService: GestPresidiService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: { paziente: Paziente  }) { }

    ngOnInit() {
      this.loadPresidi();
    }
  
  
    loadPresidi(){
      this.presidiService.getPresidi().then((result) => {
        this.allPresidi = result;
      });
  
  
      this.presidiService.getPresidiByPaziente(this.data.paziente._id).then((result) => {
        this.presidi = result;
  
        this.dataSource = new MatTableDataSource<Presidi>(this.presidi);
        this.dataSource.paginator = this.paginator;
      });
    }
  
    ngAfterViewInit() {
      this.loadPresidi();
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    async newItem() {
      var dialogRef = undefined;
  
      dialogRef = this.dialog.open(DialogPresidioPazienteComponent, {
        data: { row: new Presidi(),  title: 'Assegna Presidio' },
      });
  
      if (dialogRef != undefined)
        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed");
  
          if (result != undefined && result) {
  
            console.log("result: " + JSON.stringify(result));
            var presidio = this.allPresidi.filter(x => x._id === result._id);
            console.log("presidio: " + JSON.stringify(presidio));
  
            result.nome = presidio[0].nome;
            result.descrizione = presidio[0].descrizione;
            result.taglia = presidio[0].taglia;
            result.paziente = this.data.paziente._id;
            result.pazienteName = this.data.paziente.nome + ' ' +  this.data.paziente.cognome;
  
  
            this.presidiService
              .insert(result)
              .then((r) => {
                console.log("Update Completed. Result: ", r);
                this.presidi.push(result);
                this.dataSource.data = this.presidi;
              })
              .catch((err) => {
                console.error("Error update farmaco: ", err);
              });
          }
        });
    }



    editQtyItem(presidio: Presidi) {
      var dialogRef = undefined;
  
      dialogRef = this.dialog.open(DialogPresidioPazienteComponent, {
        data: { row: presidio,  title: 'Modifica quantità Presidio' },
      });
      if (dialogRef != undefined)
        dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined && result) {

          console.log("result: " + JSON.stringify(result));

          this.presidiService
            .update(result)
            .then((x) => {
              const index = this.presidi.indexOf(presidio);
  
              this.presidi[index] = presidio;
  
              this.dataSource.data = this.presidi;
              //dialogDocCMCF.close(result);
            })
            .catch((err) => {
              if (err["status"] != undefined && err["status"] != 500)
                this.messageService.showMessageError(
                  "Errore update Presidio (" + err["status"] + ")"
                );
            });
        }
      });
    }
  

}
