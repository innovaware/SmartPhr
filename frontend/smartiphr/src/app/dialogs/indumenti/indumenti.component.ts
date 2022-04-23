import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Paziente } from 'src/app/models/paziente';
import { ArmadioService } from 'src/app/service/armadio.service';
import { MessagesService } from 'src/app/service/messages.service';
import { Armadio, Contenuto, Indumento, IndumentoTemplate } from 'src/app/models/armadio';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IndumentiService } from 'src/app/service/indumenti.service';
import { Camere } from 'src/app/models/camere';
import { CamereService } from 'src/app/service/camere.service';

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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  adding: boolean = false;

  selectedAddingIndumento: string;
  selectedQtaIndumento: number = 1;
  selectedNoteIndumento: string = "";
  indumenti: Observable<IndumentoTemplate[]>;

  currentArmadio: Armadio;
  currentCamera: BehaviorSubject<Camere> = new BehaviorSubject(null);

  constructor(
    public dialogRef: MatDialogRef<IndumentiComponent>,
    private armadioService: ArmadioService,
    private indumentiService: IndumentiService,
    private camereService: CamereService,
    public dialog: MatDialog,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
    }) {
      this.dataSourceIndumenti = new MatTableDataSource([]);

      this.load();
    }

    load() {
      console.log("paziente:", this.data.paziente);

      this.camereService.get(this.data.paziente.idCamera).subscribe((camera: Camere) => this.currentCamera.next(camera))
      this.armadioService.getIndumenti(this.data.paziente.idCamera, new Date())
      .pipe(
        map( (armadio: Armadio[])=> {
          return armadio[0]
        })
      )
      .subscribe((armadio: Armadio)=>{

        this.currentArmadio = armadio;

        if (this.currentArmadio === undefined) {
          this.messageService.showMessageError("Attenzione armadio non presente in questa camera. Procedere nella creazione nella sezione Camere");
        }
        // if (armadio !== undefined) {
        //   this.camereService.get(armadio.idCamera).subscribe((camera: Camere) => this.currentCamera.next(camera))
        // }

        let indumenti: Indumento[] = [];
        if (armadio !== undefined) {
          const contenuto = armadio.contenuto.filter(content=> content.idPaziente === this.data.paziente._id);
          indumenti = contenuto.flatMap(c => c.items);
        }

        this.dataSourceIndumenti = new MatTableDataSource(indumenti);
        this.dataSourceIndumenti.paginator = this.paginator;
      });
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
      note: this.selectedNoteIndumento,
    };


    const contenuto = this.currentArmadio.contenuto.filter(c => c.idPaziente === this.data.paziente._id);
    if (contenuto !== undefined) {
      if (contenuto.length <= 0) {
        this.currentArmadio.contenuto.push({
          idPaziente: this.data.paziente._id,
          items: [indumentoAdding],
          verificato: false,
          paziente: this.data.paziente
        });
      } else {
        contenuto[0].items.push(indumentoAdding);
      }

      this.armadioService.update(this.currentArmadio, "Inserimento Indumento").subscribe( result => {
        this.messageService.showMessageError("Indumento inserito correttamente");
        this.load();
        this.adding = false;
      });
    }

  }

}
