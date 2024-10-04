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
  selector: 'app-assegnazione-letto',
  templateUrl: './assegnazione-letto.component.html',
  styleUrls: ['./assegnazione-letto.component.css']
})
export class AssegnazioneLettoComponent implements OnInit {

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

  camere: Camere[];
  assegnato: Boolean;
  paziente: Paziente;
  nomecamera: String;
  refreshPatients = new BehaviorSubject<boolean>(true);
  lettidisp: string[];
  constructor(
    public dialogRef: MatDialogRef<AssegnazioneLettoComponent>,
    private messageService: MessagesService,
    private patientService: PazienteService,
    private camereService: CamereService,
    private armadioService: ArmadioService,
    private authenticationService: AuthenticationService,
    private dipendentiService: DipendentiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
    }
  ) {
    this.lettidisp = [];
    this.camere = [];
    this.paziente = data.paziente;
    this.assegnato = false;
  }

  ngOnInit(): void {
    this.lettidisp = [];
    this.camere = [];
    this.camereService.getByPiano("2p").toPromise().then((result) => {
      this.camere = result.filter(x => x.numPostiLiberi > 0 && x.numMaxPosti !== null && x.numMaxPosti !== undefined && x.numMaxPosti !== x.numPostiOccupati)
        .sort((a: Camere, b: Camere) => {
          const getNumberFromCameraString = (camera: string): number => {
            const match = camera.match(/Camera (\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          };

          return getNumberFromCameraString(a.camera) - getNumberFromCameraString(b.camera);
        });
    });
    if (this.paziente.idCamera !== undefined && this.paziente.idCamera !== null) {
      this.assegnato = true;
      this.camereService.get(this.paziente.idCamera).toPromise().then((result) => {
        this.nomecamera = result.camera;
      });
    }
  }
  associaCamera()
  {
    var campi = "";
    if (this.paziente.idCamera === undefined || this.paziente.idCamera==null)
    {
      campi += "Camera";
    }
    if (this.paziente.numletto === undefined || this.paziente.numletto == null || this.paziente.numletto=="") {
      campi += campi != "" ? " e posto letto" : "Posto letto";
    }
    if (campi != "") {
      this.messageService.showMessageError(`I campi ${campi} non sono stati configurati!!`);
      return;
    }
    this.patientService.save(this.paziente)
      .then(result => {
        this.authenticationService.getCurrentUserAsync().subscribe(
          (user) => {
            const date = new Date();
            const dateStartRif = new Date(date.getFullYear(), date.getMonth(), 1);
            const dateEndRif = new Date(date.setMonth(date.getMonth() + 8));
            let dipendente = "";
            this.dipendentiService.getById(user.dipendenteID).then((dip) => {
              dipendente = dip.cognome + " " + dip.nome;
              this.armadioService.add({
                idCamera: this.paziente.idCamera,
                contenuto: [],
                rateVerifica: 0,
                pazienteId: this.paziente._id,
                lastChecked: {
                  _id: user.dipendenteID,
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
        this.assegnato = true;
        this.camereService.get(this.paziente.idCamera).toPromise().then((result) => {
          result.numPostiLiberi--;
          result.numPostiOccupati++;
          this.nomecamera = result.camera;
          this.camereService.update(result).subscribe();
        });
      })
      .catch(err => {
        this.messageService.showMessageError("Associazione annullata");
      });

  }

  displayFn(patient: Paziente): string {
    return patient && patient.nome + ' ' + patient.cognome;
  }

  changeCamera(event: any) {
    this.lettidisp = [];
    const filterValue = event.value;
    let cam: Camere;
    this.camereService.get(filterValue).toPromise().then((result) => {
      for (let i: number = 0; i < result.numMaxPosti; i++) {
        this.lettidisp[i] = (i + 1).toString();
      }
      this.patientService.getPazientiByCamera(result._id).toPromise().then((patientResult: Paziente[]) => {
        patientResult.forEach((p: Paziente) => {
          this.lettidisp = this.lettidisp.filter(x => x !== p.numletto);
        })
      });
    });          
  }
  

}
