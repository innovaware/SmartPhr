import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheda-ulcere',
  templateUrl: './scheda-ulcere.component.html',
  styleUrls: ['./scheda-ulcere.component.css']
})
export class SchedaUlcereComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
