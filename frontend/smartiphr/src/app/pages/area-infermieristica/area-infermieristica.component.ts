import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-area-infermieristica',
  templateUrl: './area-infermieristica.component.html',
  styleUrls: ['./area-infermieristica.component.css']
})
export class AreaInfermieristicaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  show(paziente: Paziente) {

  }
}
