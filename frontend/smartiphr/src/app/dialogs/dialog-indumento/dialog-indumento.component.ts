import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Paziente } from 'src/app/models/paziente';
import { ArmadioService } from 'src/app/service/armadio.service';
import { MessagesService } from 'src/app/service/messages.service';
import { Armadio } from 'src/app/models/armadio';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IndumentiService } from 'src/app/service/indumenti.service';
import { Camere } from 'src/app/models/camere';
import { CamereService } from 'src/app/service/camere.service';
import { Indumento } from '../../models/indumento';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { Dipendenti } from '../../models/dipendenti';

@Component({
  selector: 'app-dialog-indumento',
  templateUrl: './dialog-indumento.component.html',
  styleUrls: ['./dialog-indumento.component.css']
})
export class DialogIndumentoComponent implements OnInit {

  displayedColumnsIndumenti: string[] = [
    "nome",
    "quantita",
    "note",
    "action",
  ];

  dataSourceIndumenti: MatTableDataSource<Indumento>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  carico: number;
  scarico: number;
  quantita: number;
  note: string;
  currentArmadio: Armadio;

  constructor(
    private armadioService: ArmadioService,
    private authenticationService: AuthenticationService,
    private dipendentiService: DipendentiService,
    private indumentiService: IndumentiService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      indumento: Indumento;
      armadioData: Armadio;
    }) {
    this.dataSourceIndumenti = new MatTableDataSource([]);
    this.currentArmadio = this.data.armadioData; 
    this.carico = 0;
    this.scarico = 0;
    this.quantita = this.data.indumento.quantita.valueOf();
    this.note = "";
  }


  ngOnInit(): void {
  }

  salva() {
    var indumento: Indumento = this.data.indumento;
    if (this.carico > 0) {
      this.quantita += this.carico;
      indumento.carico = this.carico;
      indumento.quantita = this.quantita;
    }
    if (this.scarico > 0) {
      if (this.scarico > this.quantita) this.scarico = this.quantita;
      this.quantita -= this.scarico;
      indumento.scarico = this.scarico;
      indumento.quantita = this.quantita;
    }
    if (this.quantita < 0) indumento.quantita = 0;
    indumento.note = this.note;
    const contenuto = this.currentArmadio.contenuto;

    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        this.dipendentiService.getById(user.dipendenteID).then((resulta: Dipendenti) => {
          indumento.lastChecked.UserName = resulta.cognome + " " + resulta.nome;
          this.currentArmadio.lastChecked.idUser = resulta._id;
          this.currentArmadio.lastChecked.datacheck = new Date();

          if (contenuto !== undefined) {
            var flag: boolean = false;
            for (var i: number = 0; i < contenuto.length; i++) {
              if (contenuto[i].nome == indumento.nome) {
                contenuto[i].quantita = indumento.quantita;
                contenuto[i].carico = indumento.carico;
                contenuto[i].scarico = indumento.scarico;
                contenuto[i].lastChecked = indumento.lastChecked;
                flag = true;
                break;
              }
            }
            this.armadioService.update(this.currentArmadio, "Modifica Indumento").subscribe(result => {
              this.messageService.showMessageError("Indumento modificato correttamente");
            });
          }
        });
      }
    );
  }


}
