import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Paziente } from 'src/app/models/paziente';
import { schedaPisico } from 'src/app/models/schedaPisico';

@Component({
  selector: 'app-valuta-pisico',
  templateUrl: './valuta-pisico.component.html',
  styleUrls: ['./valuta-pisico.component.css']
})
export class ValutaPisicoComponent implements OnInit {
  @Input() schedaPisico: schedaPisico;

  constructor() { }

  ngOnInit() {
  }

}
