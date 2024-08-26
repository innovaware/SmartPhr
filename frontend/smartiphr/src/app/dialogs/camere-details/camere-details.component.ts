import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Camere } from 'src/app/models/camere';
import { Paziente } from 'src/app/models/paziente';
import { Piano } from 'src/app/models/piano';
import { ArmadioService } from 'src/app/service/armadio.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CamereService } from 'src/app/service/camere.service';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';
import { Armadio } from '../../models/armadio';
import { DipendentiService } from '../../service/dipendenti.service';

@Component({
  selector: 'app-camere-details',
  templateUrl: './camere-details.component.html',
  styleUrls: ['./camere-details.component.css']
})
export class CamereDetailsComponent implements OnInit {

  pianoList: Observable<Piano[]> = of([
    { code: "1p", description: "Piano Terra" },
    { code: "2p", description: "Primo Piano" },
    { code: "1c", description: "Chiesa - Terra" },
    { code: "2c", description: "Chiesa - Primo" }
  ]);


  displayedColumns: string[] = [
    "nome",
    "cognome",
    "codiceFiscale",
    "action",
  ];

  inputSearchField: Paziente;
  inputBedField: string = "";
  patients: Observable<Paziente[]>;
  refreshPatients = new BehaviorSubject<boolean>(true);
  allPatients: Observable<Paziente[]>;
  countPatientInCamera: number = 0;
  lettidisp: string[];
  constructor(
    public dialogRef: MatDialogRef<CamereDetailsComponent>,
    private messageService: MessagesService,
    private patientService: PazienteService,
    private camereService: CamereService,
    private armadioService: ArmadioService,
    private dipendentiService: DipendentiService,
    private authenticationService: AuthenticationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
      editMode: boolean;
    }
  ) {
    this.lettidisp = [];
  }

  ngOnInit(): void {
    this.lettidisp = [];
    // this.patients = this.patientService.getPazientiByCamera(this.data.camera._id);
    for (let i: number = 0; i < this.data.camera.numMaxPosti; i++) {
      this.lettidisp[i] = (i + 1).toString();
    }
    this.patients = this.refreshPatients.pipe(
      switchMap(_ =>
        this.patientService.getPazientiByCamera(this.data.camera._id).pipe(
          map(p => {
            this.countPatientInCamera = p.length;
            this.data.camera.numPostiOccupati = this.countPatientInCamera;
            this.data.camera.numPostiLiberi = this.data.camera.numMaxPosti - this.data.camera.numPostiOccupati;
            p.forEach((x: Paziente) => {
              this.lettidisp = this.lettidisp.filter(item => item !== x.numletto);
            });

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
        map(x => x.filter(p =>
          p.idCamera === undefined || p.idCamera === null)
        )
      );


  }

  disassociaPaziente(patient: Paziente) {
    this.messageService.deleteMessageQuestion("Vuoi dissociare il paziente dalla camera ?")
      .subscribe(success => {
        if (success == true) {
          patient.idCamera = undefined;
          this.lettidisp.push(patient.numletto);
          this.lettidisp.sort();
          this.data.camera.numPostiLiberi++;
          this.data.camera.numPostiOccupati--;
          this.armadioService.getByPaziente(patient._id).then((result: Armadio) => {
            this.armadioService.delete(result).subscribe();
          });
          this.patientService
            .save(patient)
            .then((result: Paziente) => {
              this.refreshPatients.next(true);

            });

        } else {
          this.messageService.showMessageError("Disassociazione annullata");
        }
      },
        err => {
          
          this.messageService.showMessageError("Disassociazione annullata");
        });
  }


  associaPatient() {

    if (this.inputSearchField !== undefined &&
      this.countPatientInCamera < this.data.camera.numMaxPosti) {
      const selectedPatient = this.inputSearchField;
      selectedPatient.numletto = this.inputBedField;
      selectedPatient.idCamera = this.data.camera._id;
      selectedPatient.numstanza = this.data.camera.camera;
      this.data.camera.numPostiLiberi--;
      this.data.camera.numPostiOccupati++;
      this.patientService.save(selectedPatient)
        .then(result => {
          this.lettidisp = this.lettidisp.filter(item => item !== result.numletto);
          this.refreshPatients.next(true);
          this.inputSearchField = undefined;
          this.inputBedField = undefined;
          this.authenticationService.getCurrentUserAsync().subscribe(
            (user) => {
              const date = new Date();
              const dateStartRif = new Date(date.getFullYear(), date.getMonth(), 1);
              const dateEndRif = new Date(date.setMonth(date.getMonth() + 8));
              let dipendente = "";
              this.dipendentiService.getById(user.dipendenteID).then((dip) => {
                dipendente = dip.cognome + " " + dip.nome;
                this.armadioService.add({
                  idCamera: this.data.camera._id,
                  contenuto: [],
                  rateVerifica: 0,
                  pazienteId: selectedPatient._id,
                  lastChecked: {
                    datacheck: new Date(),
                    idUser: dipendente
                  },
                  dateStartRif: dateStartRif,
                  dateEndRif: dateEndRif,
                  verified: false
                }, "Creato armadio").subscribe(
                  result => {
                  });
              });

            });
        })
        .catch(err => {
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
    if (value < this.countPatientInCamera) {
      this.data.camera.numMaxPosti = value;
    }
    for (let i: number = 0; i < this.data.camera.numMaxPosti; i++) {
      this.lettidisp[i] = (i + 1).toString();
    }
    this.patients = this.refreshPatients.pipe(
      switchMap(_ =>
        this.patientService.getPazientiByCamera(this.data.camera._id).pipe(
          map(p => {
            this.countPatientInCamera = p.length;
            p.forEach((x: Paziente) => {
              this.lettidisp = this.lettidisp.filter(item => item !== x.numletto);
            });

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

  }
  salva() {
    if (this.data.camera.numMaxPosti < this.data.camera.numPostiOccupati) {
      this.data.camera.numMaxPosti = this.data.camera.numPostiOccupati;
      this.data.camera.numPostiLiberi = 0;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.allPatients = this.patientService.getPazientiObservable()
      .pipe(
        map(f => f.filter(x =>
          (
            x.nome.toLowerCase().includes(filterValue.toLowerCase()) ||
            x.cognome.toLowerCase().includes(filterValue.toLowerCase())
          ) &&
          (x.idCamera === undefined || x.idCamera === null)
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
