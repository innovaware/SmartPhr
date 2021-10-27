import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
@Component({
  selector: 'app-esame-generale',
  templateUrl: './esame-generale.component.html',
  styleUrls: ['./esame-generale.component.css']
})
export class EsameGeneraleComponent implements OnInit {
  @Input() data;
  public element: CartellaClinica = new CartellaClinica();

  constructor() { 
    if(this.data != undefined)
      this.element = this.data;
  }

  ngOnInit() {
  }

}
