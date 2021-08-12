import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheda-bai',
  templateUrl: './scheda-bai.component.html',
  styleUrls: ['./scheda-bai.component.css']
})
export class SchedaBAIComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
