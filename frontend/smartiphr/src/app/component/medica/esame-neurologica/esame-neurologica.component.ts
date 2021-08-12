import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-esame-neurologica',
  templateUrl: './esame-neurologica.component.html',
  styleUrls: ['./esame-neurologica.component.css']
})
export class EsameNeurologicaComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
