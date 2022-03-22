import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Attivita } from 'src/app/models/attivita';
import { Paziente } from 'src/app/models/paziente';
import { AttivitaService } from 'src/app/service/attivita.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-dialog-attivita',
  templateUrl: './dialog-attivita.component.html',
  styleUrls: ['./dialog-attivita.component.css']
})
export class DialogAttivitaComponent implements OnInit {

  @ViewChild("paginatorAttivita", { static: false })
  AttivitaPaginator: MatPaginator;
  public attivitaDataSource: MatTableDataSource<Attivita>;
  public attivita: Attivita[];

  public visible = false;

  public nuovoAttivita: Attivita = {};
  paziente: Paziente;
  DisplayedColumns: string[] = ["description", "data", "operator", "turno"];
  
  constructor(public dialogRef: MatDialogRef<DialogAttivitaComponent>,
    public attivitaService: AttivitaService,
    public dialog: MatDialog,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) { 
      this.paziente = Paziente.clone(data.paziente);
    }

  ngOnInit() {
    var data =  new Date();
    let hour = data.getHours();
    var turno = 'Mattina';
    if(hour > 13)
      turno = 'Poneriggio';
    if(hour > 21)
      turno = 'Notte';    
    this.nuovoAttivita = {
      paziente: this.paziente._id,
      pazienteName: this.paziente.nome + ' ' + this.paziente.cognome,
      operator: this.paziente._id,
      operatorName: this.paziente.nome + ' ' + this.paziente.cognome,
      description: "",
      data: data,
      turno: turno,
      completato: false
    };

    this.getAttivitaOdierne();
  }



  async save(nuovoAttivita: Attivita) {

    this.attivitaService
      .insert(nuovoAttivita)
      .then((result: Attivita) => {
        console.log("Insert AttivitaOdierne: ", result);
        this.attivita.push(result);
        this.attivitaDataSource.data = this.attivita;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento AttivitaOdierne");
        console.error(err);
      });
  }

  async getAttivitaOdierne() {
    console.log(`get AttivitaOdierne paziente: ${this.paziente._id}`);
    this.attivitaService
      .getAttivitaByPaziente(this.paziente._id)
      .then((f: Attivita[]) => {
        this.attivita = f;
        var data =  new Date();
        let hour = data.getHours();
        var turno = 'Mattina';
        if(hour > 13)
          turno = 'Poneriggio';
        if(hour > 21)
          turno = 'Notte';    

        let item = this.attivita.find(i => i.turno === turno);
        if(item != null )
          this.visible = true;

        this.attivitaDataSource = new MatTableDataSource<Attivita>(
          this.attivita
        );
        this.attivitaDataSource.paginator = this.AttivitaPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista AttivitaOdierne"
        );
        console.error(err);
      });
  }



}
