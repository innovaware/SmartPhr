import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-area-educativa',
  templateUrl: './area-educativa.component.html',
  styleUrls: ['./area-educativa.component.css']
})
export class AreaEducativaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }


  show(paziente: Paziente) {

  }
}


