import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archivi-verbali',
  templateUrl: './archivi-verbali.component.html',
  styleUrls: ['./archivi-verbali.component.css']
})
export class ArchiviVerbaliComponent implements OnInit {
  typeDocument: string = "Verbali";

  constructor() {}

  ngOnInit() {}
}
