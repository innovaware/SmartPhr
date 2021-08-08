import { Component, Input, OnInit } from '@angular/core';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-esame-pisico',
  templateUrl: './esame-pisico.component.html',
  styleUrls: ['./esame-pisico.component.css']
})
export class EsamePisicoComponent implements OnInit {
  @Input() data: Paziente;
  constructor() { }

  ngOnInit() {
  }


  showInput(value: string[], item: string) {
    return value.findIndex(x=> x === item) >= 0;
  }
}
