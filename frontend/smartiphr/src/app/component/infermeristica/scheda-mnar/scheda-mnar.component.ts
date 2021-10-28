import { Component, Input, OnInit } from '@angular/core';
import { SchedaMnar } from 'src/app/models/SchedaMnar';

@Component({
  selector: 'app-scheda-mnar',
  templateUrl: './scheda-mnar.component.html',
  styleUrls: ['./scheda-mnar.component.css']
})
export class SchedaMNARComponent implements OnInit {
  @Input() data: SchedaMnar;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
