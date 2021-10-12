import { Component, Input, OnInit } from '@angular/core';
import { Fornitore } from 'src/app/models/fornitore';
import { Output, EventEmitter } from '@angular/core';
import { FornitoreService } from 'src/app/service/fornitore.service';

@Component({
  selector: 'app-fornitore',
  templateUrl: './fornitore.component.html',
  styleUrls: ['./fornitore.component.css']
})
export class FornitoreGeneraleComponent implements OnInit {
  @Input() data: Fornitore;
  @Input() disable: boolean;
  @Output() dataChange = new EventEmitter<Fornitore>();
  @Output() saveEmiter = new EventEmitter<Fornitore>();

  constructor() { }

  ngOnInit() {
    console.log("Cartella generale fornitore: ", this.data);
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
