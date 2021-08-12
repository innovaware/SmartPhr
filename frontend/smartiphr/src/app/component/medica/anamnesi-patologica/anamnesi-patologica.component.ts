import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-anamnesi-patologica',
  templateUrl: './anamnesi-patologica.component.html',
  styleUrls: ['./anamnesi-patologica.component.css']
})
export class AnamnesiPatologicaComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
