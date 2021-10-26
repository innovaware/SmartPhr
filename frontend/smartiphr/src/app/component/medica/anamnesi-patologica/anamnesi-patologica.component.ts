import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';

@Component({
  selector: 'app-anamnesi-patologica',
  templateUrl: './anamnesi-patologica.component.html',
  styleUrls: ['./anamnesi-patologica.component.css']
})
export class AnamnesiPatologicaComponent implements OnInit {
  @Input() data;
  public element: CartellaClinica = new CartellaClinica();

  constructor() { 
    if(this.data != undefined)
      this.element = this.data;
  }

  ngOnInit() {
  }

}
