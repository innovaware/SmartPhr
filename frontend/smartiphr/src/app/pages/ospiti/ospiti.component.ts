import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ospiti',
  templateUrl: './ospiti.component.html',
  styleUrls: ['./ospiti.component.css']
})
export class OspitiComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  show($event) {
    console.log($event);
  }
}
