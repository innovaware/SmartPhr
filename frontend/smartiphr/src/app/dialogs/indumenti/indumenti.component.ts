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
  selector: 'app-indumenti',
  templateUrl: './indumenti.component.html',
  styleUrls: ['./indumenti.component.css']
})
export class IndumentiComponent implements OnInit {

  displayedColumnsIndumenti: string[] = [
    "nome",
    "quantita",
    "note",
    "action",
  ];

  dataSourceIndumenti: MatTableDataSource<Indumento>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  adding: boolean = false;

  selectedAddingIndumento: string;
  selectedQtaIndumento: number = 1;
  selectedNoteIndumento: string = "";
  indumenti: Observable<Indumento[]>;

  currentArmadio: Armadio;
  currentCamera: BehaviorSubject<Camere> = new BehaviorSubject(null);

  constructor(
    public dialogRef: MatDialogRef<IndumentiComponent>,
    private armadioService: ArmadioService,
    private authenticationService: AuthenticationService,
    private dipendentiService: DipendentiService,
    private indumentiService: IndumentiService,
    public dialog: MatDialog,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      armadioData: Armadio;
      paziente: Paziente;
    }) {
    this.dataSourceIndumenti = new MatTableDataSource([]);
    this.currentArmadio = this.data.armadioData;
    this.load();
  }

  load() {
    let indumenti = this.currentArmadio.contenuto;
    this.dataSourceIndumenti = new MatTableDataSource(indumenti);
    this.dataSourceIndumenti.paginator = this.paginator;
  }

  ngOnInit(): void {
  }

  Reset() {
    this.selectedAddingIndumento = undefined;
    this.selectedNoteIndumento = "";
    this.selectedQtaIndumento = 1;
  }

  showAddIndumentoForm() {
    this.adding = true;
    this.indumenti = this.indumentiService.getIndumenti();

  }

  AddIndumento() {
    if (this.currentArmadio === undefined) {
      this.messageService.showMessageError("Attenzione armadio non presente in questa camera. Procedere nella creazione nella sezione Camere");
      return false;
    }

    if (this.selectedAddingIndumento === undefined || this.selectedQtaIndumento <= 0) {
      this.messageService.showMessageError("Seleziona un indumento e la quantità maggiore di zero");
      return false;
    }

    const indumentoAdding: Indumento = {
      nome: this.selectedAddingIndumento,
      quantita: this.selectedQtaIndumento,
      carico: 0,
      dataCaricamento: new Date(),
      lastChecked: {
        UserName: "",
        datacheck: new Date()
      },
      scarico: 0,
      note: ""
    };

    const contenuto = this.currentArmadio.contenuto;

    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        this.dipendentiService.getById(user.dipendenteID).then((resulta: Dipendenti) => {
          indumentoAdding.lastChecked.UserName = resulta.cognome + " " + resulta.nome;
          console.log("User set: ", indumentoAdding.lastChecked.UserName);
          console.log("User get: ", resulta.cognome + " " + resulta.nome);
          this.currentArmadio.lastChecked.idUser = resulta.cognome + " " + resulta.nome;
          this.currentArmadio.lastChecked.datacheck = new Date();

          if (contenuto !== undefined) {
            var flag: boolean = false;
            for (var i: number = 0; i < contenuto.length; i++) {
              if (contenuto[i].nome == indumentoAdding.nome) {
                contenuto[i].quantita += indumentoAdding.quantita;
                contenuto[i].carico += indumentoAdding.quantita;
                contenuto[i].lastChecked = indumentoAdding.lastChecked;
                flag = true;
                break;
              }
            }
            if (!flag) this.currentArmadio.contenuto.push(indumentoAdding);
            this.armadioService.update(this.currentArmadio, "Inserimento Indumento").subscribe(result => {
              this.messageService.showMessageError("Indumento inserito correttamente");
              this.adding = false;
              this.load();
              this.Reset();
            });
          }
        });
      }
    );


  }
}
