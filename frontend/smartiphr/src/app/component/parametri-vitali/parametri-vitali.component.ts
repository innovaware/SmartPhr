import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametri-vitali',
  templateUrl: './parametri-vitali.component.html',
  styleUrls: ['./parametri-vitali.component.css']
})
export class ParametriVitaliComponent implements OnInit {
  @Input() id: string; //Id paziente

  constructor() { }


  ngOnInit() {
  }


  getDays() {
    return Array.from({length: 31}, (v, k) => k+1);
  }

  getValue() {
    const max = 40;
    const min = 35;
    return (Math.random() * (max - min + 1) + min).toFixed(2);
  }

}
