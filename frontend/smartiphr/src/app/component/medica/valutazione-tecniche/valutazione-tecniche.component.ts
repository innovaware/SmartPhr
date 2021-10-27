import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';

@Component({
  selector: 'app-valutazione-tecniche',
  templateUrl: './valutazione-tecniche.component.html',
  styleUrls: ['./valutazione-tecniche.component.css']
})
export class ValutazioneTecnicheComponent implements OnInit {
  @Input() data;
  public element: CartellaClinica = new CartellaClinica();

  constructor() { 
    if(this.data != undefined)
      this.element = this.data;
  }


  ngOnInit() {
  }

}
