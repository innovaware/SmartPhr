import { Component, Input, OnInit } from '@angular/core';
import { ICF } from '../../../models/ICF';
@Component({
  selector: 'app-ICF',
  templateUrl: './ICF.component.html',
  styleUrls: ['./ICF.component.css']
})
export class ICFComponent implements OnInit {

  @Input() data: ICF;
  @Input() disable: Boolean;

  constructor() {
    
   }

  ngOnInit() {
    
  }


}
