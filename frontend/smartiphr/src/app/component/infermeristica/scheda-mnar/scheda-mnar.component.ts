import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheda-mnar',
  templateUrl: './scheda-mnar.component.html',
  styleUrls: ['./scheda-mnar.component.css']
})
export class SchedaMNARComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
