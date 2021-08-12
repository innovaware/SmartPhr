import { Component, Input, OnInit } from '@angular/core';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-paziente-generale',
  templateUrl: './paziente-generale.component.html',
  styleUrls: ['./paziente-generale.component.css']
})
export class PazienteGeneraleComponent implements OnInit {
  @Input() data: Paziente;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
    console.log("Cartella generale paziente: ", this.data);
  }

}
