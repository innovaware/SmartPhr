import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheda-lesioni-cutanee',
  templateUrl: './scheda-lesioni-cutanee.component.html',
  styleUrls: ['./scheda-lesioni-cutanee.component.css']
})
export class SchedaLesioniCutaneeComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
