import { Component, Input, OnInit } from '@angular/core';
import { Fornitori } from 'src/app/models/fornitori';
import { Output, EventEmitter } from '@angular/core';
import { FornitoriService } from 'src/app/service/fornitori.service';

@Component({
  selector: 'app-fornitore',
  templateUrl: './fornitore.component.html',
  styleUrls: ['./fornitore.component.css']
})
export class FornitoreGeneraleComponent implements OnInit {
  @Input() data: Fornitori;
  @Input() disable: boolean;
  @Output() dataChange = new EventEmitter<Fornitori>();
  @Output() saveEmiter = new EventEmitter<Fornitori>();

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
