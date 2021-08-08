import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-area-medica',
  templateUrl: './area-medica.component.html',
  styleUrls: ['./area-medica.component.css']
})
export class AreaMedicaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  show(paziente: Paziente) {

  }
}
