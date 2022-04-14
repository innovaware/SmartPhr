import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Camere } from 'src/app/models/camere';
import { Paziente } from 'src/app/models/paziente';
import { Piano } from 'src/app/models/piano';
import { CamereService } from 'src/app/service/camere.service';
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
  countPatientInCamera: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CamereDetailsComponent>,
    private messageService: MessagesService,
    private patientService: PazienteService,
    private camereService: CamereService,
    private router: Router,
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
      switchMap( _ =>
        this.patientService.getPazientiByCamera(this.data.camera._id).pipe(
          map( p=> {
            this.countPatientInCamera = p.length;

            if (this.countPatientInCamera >= this.data.camera.numMaxPosti) {
              this.data.camera.numMaxPosti = this.countPatientInCamera;
            }

            if (this.data.camera.numPostiLiberi !== this.countPatientInCamera) {
              this.data.camera.numPostiLiberi = this.countPatientInCamera;
            }

            this.camereService.update(this.data.camera).subscribe(
              (result => {
                console.log("Fix and setting numMax for camera");
              })
            );
            return p;
          })
        )
      )
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

    if (this.inputSearchField !== undefined &&
      this.countPatientInCamera < this.data.camera.numMaxPosti) {
        console.log("Adding patient:", this.inputSearchField);
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

  changeMaxPosti(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    const value = parseInt(filterValue);
    if (value < this.countPatientInCamera)  {
      this.data.camera.numMaxPosti = value;
    }
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

  navCameraMap() {
    this.dialogRef.close(false);
    this.router.navigate(
      ['/gest_camere'],
      { queryParams: { camera: this.data.camera._id } }
    );
  }

}
