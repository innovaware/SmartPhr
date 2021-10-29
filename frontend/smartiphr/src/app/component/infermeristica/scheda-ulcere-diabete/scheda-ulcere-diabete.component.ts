import { Component, Input, OnInit } from '@angular/core';
import { SchedaUlcereDiabete } from 'src/app/models/SchedaUlcereDiabete';

@Component({
  selector: 'app-scheda-ulcere-diabete',
  templateUrl: './scheda-ulcere-diabete.component.html',
  styleUrls: ['./scheda-ulcere-diabete.component.css']
})
export class SchedaUlcereDiabeteComponent implements OnInit {
  @Input() data: SchedaUlcereDiabete;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
