import { Component, Input, OnInit } from '@angular/core';
import { Paziente } from 'src/app/models/paziente';
import { Output, EventEmitter } from '@angular/core';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-paziente-generale',
  templateUrl: './paziente-generale.component.html',
  styleUrls: ['./paziente-generale.component.css']
})
export class PazienteGeneraleComponent implements OnInit {
  @Input() data: Paziente;
  @Input() disable: boolean;
  @Output() dataChange = new EventEmitter<Paziente>();
  @Output() saveEmiter = new EventEmitter<Paziente>();

  constructor() { }

  ngOnInit() {
    console.log("Cartella generale paziente: ", this.data);
  }

  async save() {
    console.log("save: ", this.data);
    this.saveEmiter.emit(this.data);
  }

  async change() {
    console.log("change: ", this.data);
    this.dataChange.emit(this.data);
  }

}
