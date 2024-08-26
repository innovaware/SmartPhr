import { Component, Input, OnInit } from '@angular/core';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Paziente } from 'src/app/models/paziente';
import { schedaPsico } from 'src/app/models/schedaPsico';

@Component({
  selector: 'app-esame-pisico',
  templateUrl: './esame-pisico.component.html',
  styleUrls: ['./esame-pisico.component.css']
})
export class EsamePisicoComponent implements OnInit {
  @Input() schedaPsico: schedaPsico;

  constructor() { }

  ngOnInit() {
    // console.log("Esame Psicologico Dialog", this.schedaPsico);
  }


  showInput(value: string[], item: string) {
    return value.findIndex(x=> x === item) >= 0;
  }
}
