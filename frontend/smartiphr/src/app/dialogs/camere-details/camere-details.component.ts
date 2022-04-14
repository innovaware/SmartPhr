import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import { Camere } from 'src/app/models/camere';
import { Paziente } from 'src/app/models/paziente';
import { Piano } from 'src/app/models/piano';

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

  dataSourcePatient: MatTableDataSource<Paziente>;

  constructor(
    public dialogRef: MatDialogRef<CamereDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      camera: Camere;
      editMode: boolean;
    }
  ) {
  }

  ngOnInit(): void {
  }


}
