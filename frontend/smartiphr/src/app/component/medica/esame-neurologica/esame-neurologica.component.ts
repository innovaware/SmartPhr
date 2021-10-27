import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';

@Component({
  selector: 'app-esame-neurologica',
  templateUrl: './esame-neurologica.component.html',
  styleUrls: ['./esame-neurologica.component.css']
})
export class EsameNeurologicaComponent implements OnInit {
  @Input() data;
  public element: CartellaClinica = new CartellaClinica();

  constructor() { 
    if(this.data != undefined)
      this.element = this.data;
  }

  ngOnInit() {
  }

}
