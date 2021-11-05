import { Component, Input, OnInit} from '@angular/core';
import { schedaAnamnesiPatologica } from 'src/app/models/schedaAnamnesiPatologica';


@Component({
  selector: 'app-anamnesi-patologica',
  templateUrl: './anamnesi-patologica.component.html',
  styleUrls: ['./anamnesi-patologica.component.css']
})
export class AnamnesiPatologicaComponent implements  OnInit {
  @Input() data: schedaAnamnesiPatologica;

  constructor() {}

  ngOnInit() {
  }
}
