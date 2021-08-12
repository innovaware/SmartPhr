import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheda-vas',
  templateUrl: './scheda-vas.component.html',
  styleUrls: ['./scheda-vas.component.css']
})
export class SchedaVASComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
