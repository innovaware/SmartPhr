import { Component, Input, OnInit } from '@angular/core';
import { Dipendenti } from 'src/app/models/dipendenti';
import { Output, EventEmitter } from '@angular/core';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { Mansione } from 'src/app/models/mansione';
import { MansioniService } from 'src/app/service/mansioni.service';
import { MatDialogRef } from '@angular/material/dialog';

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

  mansioni: Mansione[] = [];

  constructor(public mansioniService: MansioniService, public dialogRef: MatDialogRef<DipendenteGeneraleComponent>,)
  {
    dialogRef.disableClose = true;
  }


  ngOnInit() {
    console.log("Cartella generale dipendente: ", this.data);
    this.mansioniService.get().then((result) => {
      this.mansioni = result;
    });
  }

  async save() {
    console.log("save: ", this.data);
    this.saveEmiter.emit(this.data);
  }

  async change() {
    console.log("change: ", this.data);
    this.dataChange.emit(this.data);
  }

  async Close() {
    window.location.reload();
  }
}
