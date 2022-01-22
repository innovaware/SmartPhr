import { Component, Input, OnInit } from '@angular/core';
import { AreaRiabilitativaProgramma } from 'src/app/models/AreaRiabilitativaProgramma';

@Component({
  selector: 'app-area-riabilitazione-programma',
  templateUrl: './area-riabilitazione-programma.component.html',
  styleUrls: ['./area-riabilitazione-programma.component.css']
})
export class AreaRiabilitazioneProgrammaComponent implements OnInit {
  @Input() data: AreaRiabilitativaProgramma;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
