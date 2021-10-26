import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CartellaClinica } from 'src/app/models/cartellaClinica';

@Component({
  selector: 'app-anamnesi-famigliare',
  templateUrl: './anamnesi-famigliare.component.html',
  styleUrls: ['./anamnesi-famigliare.component.css']
})
export class AnamnesiFamigliareComponent implements OnInit {

  @Input() data;
  public element: CartellaClinica = new CartellaClinica();



  constructor() { 
    if(this.data != undefined)
      this.element = this.data;
  }

  ngOnInit() {
    
  }

}
