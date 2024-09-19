import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archivi-impegnative',
  templateUrl: './archivi-impegnative.component.html',
  styleUrls: ['./archivi-impegnative.component.css']
})
export class ArchiviImpegnativeComponent implements OnInit {
  typeDocument: string = "Impegnativa";

  constructor() {}

  ngOnInit() {}
}
