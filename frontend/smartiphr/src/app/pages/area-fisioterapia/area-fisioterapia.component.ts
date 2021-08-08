import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-area-fisioterapia',
  templateUrl: './area-fisioterapia.component.html',
  styleUrls: ['./area-fisioterapia.component.css']
})
export class AreaFisioterapiaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }


  show(paziente: Paziente) {

  }

}
