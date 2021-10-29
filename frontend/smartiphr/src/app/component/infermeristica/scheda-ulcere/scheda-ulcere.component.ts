import { Component, Input, OnInit } from '@angular/core';
import { SchedaUlcere } from 'src/app/models/schedaUlcere';

@Component({
  selector: 'app-scheda-ulcere',
  templateUrl: './scheda-ulcere.component.html',
  styleUrls: ['./scheda-ulcere.component.css']
})
export class SchedaUlcereComponent implements OnInit {
  @Input() data: SchedaUlcere;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
