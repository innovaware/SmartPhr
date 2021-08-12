import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-anamnesi-famigliare',
  templateUrl: './anamnesi-famigliare.component.html',
  styleUrls: ['./anamnesi-famigliare.component.css']
})
export class AnamnesiFamigliareComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
