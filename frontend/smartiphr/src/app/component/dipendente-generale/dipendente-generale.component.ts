import { Component, Input, OnInit } from '@angular/core';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Output, EventEmitter } from '@angular/core';
import { DipendentiService } from 'src/app/service/dipendenti.service';

@Component({
  selector: 'app-dipendente-generale',
  templateUrl: './dipendente-generale.component.html',
  styleUrls: ['./dipendente-generale.component.css']
})
export class DipendenteGeneraleComponent implements OnInit {

  @Input() data: Dipendenti;
  @Input() disable: boolean;
  @Output() dataChange = new EventEmitter<Dipendenti>();
  @Output() saveEmiter = new EventEmitter<Dipendenti>();

  constructor() { }

  ngOnInit() {
    console.log("Cartella generale dipendente: ", this.data);
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
