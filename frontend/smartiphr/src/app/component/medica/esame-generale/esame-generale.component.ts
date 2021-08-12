import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-esame-generale',
  templateUrl: './esame-generale.component.html',
  styleUrls: ['./esame-generale.component.css']
})
export class EsameGeneraleComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
