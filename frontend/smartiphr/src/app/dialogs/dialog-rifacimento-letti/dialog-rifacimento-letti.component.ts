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
import { LettoCamera } from '../../models/lettoCamera';
import { GestLettoCameraService } from '../../service/gest-letto-camera.service';

@Component({
  selector: 'app-dialog-rifacimento-letti',
  templateUrl: './dialog-rifacimento-letti.component.html',
  styleUrls: ['./dialog-rifacimento-letti.component.css']
})
export class DialogRifacimentoLettiComponent implements OnInit {

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
  laceratoNum: number;

  constructor(
    private lettoCameraService: GestLettoCameraService,
    private authenticationService: AuthenticationService,
    private dipendentiService: DipendentiService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
        lettocamera: LettoCamera,
        isInternal: Boolean,
        dipendente: Dipendenti
    }) {
    this.carico = 0;
    this.scarico = 0;
    this.quantita = this.data.lettocamera.giacenza.valueOf();
    this.note = "";
    this.laceratoNum = 0;
  }


  ngOnInit(): void {
  }

  salva() {
    if (this.scarico > this.quantita) this.scarico = this.quantita;
    if (this.laceratoNum > this.scarico) this.laceratoNum = this.scarico;
    var op = new Number(this.carico - this.scarico);
    this.data.lettocamera.giacenza = this.data.lettocamera.giacenza.valueOf() + op.valueOf();
    if (this.data.lettocamera.giacenza.valueOf() < 0) this.data.lettocamera.giacenza = 0 ; 
    this.data.lettocamera.carico = this.carico > 0 ? this.carico : 0;
    this.data.lettocamera.scarico = this.scarico > 0 ? this.scarico : 0;
    this.data.lettocamera.laceratiNum = this.laceratoNum > 0 ? this.laceratoNum : 0;
    this.data.lettocamera.firma = this.data.dipendente.cognome + " " + this.data.dipendente.nome;
    this.data.lettocamera.operatore = this.data.dipendente._id;
    this.lettoCameraService.update(this.data.lettocamera).then();
  }


}
