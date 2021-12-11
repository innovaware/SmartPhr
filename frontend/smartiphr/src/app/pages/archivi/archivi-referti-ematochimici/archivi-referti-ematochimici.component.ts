import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archivi-referti-ematochimici',
  templateUrl: './archivi-referti-ematochimici.component.html',
  styleUrls: ['./archivi-referti-ematochimici.component.css']
})
export class ArchiviRefertiEmatochimiciComponent implements OnInit {
  typeDocument: string = "RefertoEsameEmatochimico";

  constructor() { }

  ngOnInit() {
  }

}
