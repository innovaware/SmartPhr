import { Component, Input, OnInit } from '@angular/core';
import { SchedaBAI } from 'src/app/models/SchedaBAI';

@Component({
  selector: 'app-scheda-bai',
  templateUrl: './scheda-bai.component.html',
  styleUrls: ['./scheda-bai.component.css']
})
export class SchedaBAIComponent implements OnInit {
  @Input() data: SchedaBAI;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
