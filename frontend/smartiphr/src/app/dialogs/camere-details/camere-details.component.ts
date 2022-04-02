import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Camere } from 'src/app/models/camere';
import { Paziente } from 'src/app/models/paziente';
import { Piano } from 'src/app/models/piano';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-camere-details',
  templateUrl: './camere-details.component.html',
  styleUrls: ['./camere-details.component.css']
})
export class CamereDetailsComponent implements OnInit {

  pianoList: Observable<Piano[]> = of([
    { code: "1p", description: "Piano Terra"},
    { code: "2p", description: "Primo Piano"},
    { code: "1c", description: "Chiesa - Terra"},
    { code: "2c", description: "Chiesa - Primo"}
  ]);


  displayedColumns: string[] = [
    "nome",
    "cognome",
    "codiceFiscale",
    "action",
  ];

  inputSearchField: Paziente;
  patients: Observable<Paziente[]>;
  refreshPatients = new BehaviorSubject<boolean>(true);
  allPatients: Observable<Paziente[]>;

  constructor(
    public dialogRef: MatDialogRef<CamereDetailsComponent>,
    private messageService: MessagesService,
    private patientService: PazienteService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
      editMode: boolean;
    }
  ) {
  }

  ngOnInit(): void {
    // this.patients = this.patientService.getPazientiByCamera(this.data.camera._id);
    this.patients = this.refreshPatients.pipe(
      switchMap( _ => this.patientService.getPazientiByCamera(this.data.camera._id))
    );

    this.allPatients = this.patientService.getPazientiObservable()
        .pipe(
          map( x => x.filter( p=>
            p.idCamera === undefined || p.idCamera === null)
          )
        );
  }

  disassociaPaziente(patient: Paziente) {
    this.messageService.deleteMessageQuestion("Vuoi dissociare il paziente dalla camera ?")
    .subscribe( success => {
      if (success == true) {
        patient.idCamera = undefined;
        this.patientService
          .save(patient)
          .then( (result: Paziente)=> {
              console.log("Paziente dissasociato: ", patient);
              this.refreshPatients.next(true);
          });
      } else {
        this.messageService.showMessageError("Disassociazione annullata");
      }
    },
    err=> {
      console.log("Error ", err);
      this.messageService.showMessageError("Disassociazione annullata");
    });
  }


  associaPatient() {
    console.log("Adding patient:", this.inputSearchField);

    if (this.inputSearchField !== undefined) {
      const selectedPatient = this.inputSearchField;

      selectedPatient.idCamera = this.data.camera._id;
      this.patientService.save(selectedPatient)
      .then(result => {
        console.log("Paziente Associato: ", selectedPatient);
        this.refreshPatients.next(true);
        this.inputSearchField = undefined;
      })
      .catch( err=> {
        this.messageService.showMessageError("Associazione annullata");
      });
    }

  }

  displayFn(patient: Paziente): string {
    return patient && patient.nome + ' ' + patient.cognome;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.allPatients = this.patientService.getPazientiObservable()
      .pipe(
        map( f=> f.filter( x=>
          (
            x.nome.toLowerCase().includes(filterValue.toLowerCase()) ||
            x.cognome.toLowerCase().includes(filterValue.toLowerCase())
          ) &&
            ( x.idCamera === undefined || x.idCamera === null )
        ))
      )
  }

}
