import { Component, Input, OnInit} from '@angular/core';
import { schedaEsameNeurologia } from 'src/app/models/schedaEsameNeurologia';

@Component({
  selector: 'app-esame-neurologica',
  templateUrl: './esame-neurologica.component.html',
  styleUrls: ['./esame-neurologica.component.css']
})
export class EsameNeurologicaComponent implements OnInit {
  @Input() data: schedaEsameNeurologia;

  constructor() {}

  ngOnInit() {
  }


  

}
