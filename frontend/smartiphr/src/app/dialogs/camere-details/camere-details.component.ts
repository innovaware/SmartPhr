import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of } from 'rxjs';
import { Camere } from 'src/app/models/camere';
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
