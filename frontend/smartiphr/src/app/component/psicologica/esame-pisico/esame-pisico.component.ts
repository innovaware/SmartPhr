import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Paziente } from 'src/app/models/paziente';
import { schedaPisico } from 'src/app/models/schedaPisico';

@Component({
  selector: 'app-esame-pisico',
  templateUrl: './esame-pisico.component.html',
  styleUrls: ['./esame-pisico.component.css']
})
export class EsamePisicoComponent implements OnInit {
  @Input() schedaPisico: schedaPisico;

  constructor() { }

  ngOnInit() {
    // console.log("Esame Psicologico Dialog", this.schedaPisico);
  }


  showInput(value: string[], item: string) {
    return value.findIndex(x=> x === item) >= 0;
  }
}
