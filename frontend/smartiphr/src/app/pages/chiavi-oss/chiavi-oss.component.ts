import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { gestChiavi } from 'src/app/models/gestChiavi';
import { Dipendenti } from 'src/app/models/dipendenti';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentipazientiService } from 'src/app/service/documentipazienti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
import { GestChiaviService } from 'src/app/service/gest-chiavi.service';

@Component({
  selector: 'app-chiavi-oss',
  templateUrl: './chiavi-oss.component.html',
  styleUrls: ['./chiavi-oss.component.css']
})
export class ChiaviOssComponent implements OnInit {

  @ViewChild("paginatorRecordChiavi",{static: false})
  RecordChiaviPaginator: MatPaginator;
  public nuovoRecordChiavi: gestChiavi;
  public RecordChiaviDataSource: MatTableDataSource<gestChiavi>;
  public recordsChiavi: gestChiavi[] = [];
  public uploadingRecordChiavi: boolean;
  public addingRecordChiavi: boolean;


  utente: User = {} as User;
  dipendente: Dipendenti = {} as Dipendenti;


  DisplayedColumns: string[] = ["n_mazzi", "operatorPrelievo", "datePrelievo", "operatorRiconsegna", "dateRiconsegna","action"];

  constructor(
    public gestChiaviService: GestChiaviService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,) { }

  ngOnInit(): void {
    this.loadUser();
    this.getLista();
  }


  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user._id)
        .then((x) => {
          console.log("dipendente: " + JSON.stringify(x[0]));
          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }


  async addRecordChiavi() {
    this.addingRecordChiavi = true;
    this.nuovoRecordChiavi = {
      operatorPrelievo: this.dipendente._id,
      operatorPrelievoName: this.dipendente.nome + ' ' + this.dipendente.cognome,
      chiave: 0,
    };
  }





  async save(rec: gestChiavi) {

    console.log("Prelievo Chiave : ", rec);

    this.gestChiaviService
      .insert(rec)
      .then((result: gestChiavi) => {
        console.log("Insert gestChiavi: ", result);
        this.recordsChiavi.push(result);
        this.RecordChiaviDataSource.data = this.recordsChiavi;
        this.addingRecordChiavi = false;
        this.uploadingRecordChiavi = false;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento gestChiavi");
        console.error(err);
      });
  }

  async getLista() {
    console.log(`get Lista`);
    this.gestChiaviService
      .get()
      .then((f: gestChiavi[]) => {
        this.recordsChiavi = f;

        this.RecordChiaviDataSource = new MatTableDataSource<gestChiavi>(
          this.recordsChiavi
        );
        this.RecordChiaviDataSource.paginator = this.RecordChiaviPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista gestChiavi"
        );
        console.error(err);
      });
  }

  async riconsegna(rec: gestChiavi) {

  if (confirm("Confermi Riconsegna Chiave?") == true) {
  
    rec.operatorRiconsegna =  this.dipendente._id;
    rec.operatorRiconsegnaName = this.dipendente.nome + ' ' + this.dipendente.cognome;
    rec.dataRiconsegna =  new Date();
    console.log("Riconsegna Chiave : ", rec._id);

    this.gestChiaviService
      .update(rec)
      .then((result: gestChiavi) => {

        const index = this.recordsChiavi.indexOf(rec);
        this.recordsChiavi[index] = rec;
        this.RecordChiaviDataSource.data = this.recordsChiavi;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Riconsegna gestChiavi");
        console.error(err);
      });
  }
}

}
