import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Attivita } from 'src/app/models/attivita';
import { Paziente } from 'src/app/models/paziente';
import { AttivitaService } from 'src/app/service/attivita.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-attivita-oss',
  templateUrl: './attivita-oss.component.html',
  styleUrls: ['./attivita-oss.component.css']
})
export class AttivitaOssComponent implements OnInit {

  @ViewChild("paginatorAttivita", {static: false})
  AttivitaPaginator: MatPaginator;
  public attivitaDataSource: MatTableDataSource<Attivita>;
  public attivita: Attivita[];
  DisplayedColumns: string[] = ["description", "data", "operator", "turno"];
  constructor( public attivitaService: AttivitaService,
    public dialog: MatDialog,
    public messageService: MessagesService) { }

  ngOnInit() {
    this.getAttivitaOdierne();
  }


  async getAttivitaOdierne() {
    console.log(`get AttivitaOdierne`);
    this.attivitaService
      .getAllAttivita()
      .then((f: Attivita[]) => {
        this.attivita = f;
        console.log(`get attivita: ` + JSON.stringify(this.attivita));
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
