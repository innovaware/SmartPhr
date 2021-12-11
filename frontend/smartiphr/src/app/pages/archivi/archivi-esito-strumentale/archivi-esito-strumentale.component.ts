import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archivi-esito-strumentale',
  templateUrl: './archivi-esito-strumentale.component.html',
  styleUrls: ['./archivi-esito-strumentale.component.css']
})
export class ArchiviEsitoStrumentaleComponent implements OnInit {
  typeDocument: string = "EsitoStrumentale";

  constructor() { }

  ngOnInit() {
  }

}
