import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Armadio } from 'src/app/models/armadio';
import { Paziente } from 'src/app/models/paziente';
import { DataIngressoService } from 'src/app/service/data-ingresso.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { UploadService } from 'src/app/service/upload.service';
import { ArmadioService } from 'src/app/service/armadio.service';

@Component({
  selector: 'app-dialog-armadio',
  templateUrl: './dialog-armadio.component.html',
  styleUrls: ['./dialog-armadio.component.css']
})
export class DialogArmadioComponent implements OnInit {


  @ViewChild("paginatorElementoArmadio")
  ElementoArmadioPaginator: MatPaginator;
  public nuovoElementoArmadio: Armadio;
  public ElementiArmadioDataSource: MatTableDataSource<Armadio>;
  public elementiArmadio: Armadio[] = [];
  public uploadingElementoArmadio: boolean;
  public addingElementoArmadio: boolean;

  @ViewChild("paginatorAttArmadio")
  AttArmadioPaginator: MatPaginator;
  public AttArmadioDataSource: MatTableDataSource<Armadio>;
  public attArmadio: Armadio[] = [];

  paziente: Paziente;

  DisplayedColumns: string[] = ["description", "quantity", "note", "action"];
  DisplayedColumnsAtt: string[] = ["description", "operator","date", "quantity", "note"];

  constructor(public dialogRef: MatDialogRef<DialogArmadioComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    public armadioService: ArmadioService,
    public dataIngressoService: DataIngressoService,
    public uploadService: UploadService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }) {
      this.paziente = Paziente.clone(data.paziente);
    }

  ngOnInit() {
    this.getElementi();
    this.getAttivita();
  }



  async addElemento() {
    this.addingElementoArmadio = true;
    this.nuovoElementoArmadio = {
      paziente: this.paziente._id,
      pazienteName: this.paziente.nome + ' '+ this.paziente.cognome,
      operator: this.paziente._id,
      operatorName: this.paziente.nome + ' '+ this.paziente.cognome,
      elemento: "",
      note: "",
      quantita: 0,
    };
  }


  async save(model: Armadio) {
    this.armadioService
      .insert(model)
      .then((result: Armadio) => {
        console.log("Insert ElementoArmadio: ", result);
        this.elementiArmadio.push(result);
        this.ElementiArmadioDataSource.data = this.elementiArmadio;
        this.addingElementoArmadio = false;
        this.uploadingElementoArmadio = false;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento ElementoArmadio");
        console.error(err);
      });
  }

  async getElementi() {
    console.log(`get ElementiArmadio paziente: ${this.paziente._id}`);
    this.armadioService
      .getElementiByPaziente(this.paziente._id)
      .then((f: Armadio[]) => {
        this.elementiArmadio = f;

        this.ElementiArmadioDataSource = new MatTableDataSource<Armadio>(
          this.elementiArmadio
        );
        this.ElementiArmadioDataSource.paginator = this.ElementoArmadioPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista ElementiArmadio"
        );
        console.error(err);
      });
  }


  async getAttivita() {
    console.log(`get AttivitaArmadio paziente: ${this.paziente._id}`);
    this.armadioService
      .getAttivitaByPaziente(this.paziente._id)
      .then((f: Armadio[]) => {
        this.attArmadio = f;

        this.AttArmadioDataSource = new MatTableDataSource<Armadio>(
          this.attArmadio
        );
        this.AttArmadioDataSource.paginator = this.AttArmadioPaginator;
      })
      .catch((err) => {
        this.messageService.showMessageError(
          "Errore caricamento lista AttivitaArmadio"
        );
        console.error(err);
      });
  }


  async edit(model: Armadio) {
  }



}
