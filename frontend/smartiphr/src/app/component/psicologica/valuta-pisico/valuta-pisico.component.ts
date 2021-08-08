import { Component, Input, OnInit } from '@angular/core';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-valuta-pisico',
  templateUrl: './valuta-pisico.component.html',
  styleUrls: ['./valuta-pisico.component.css']
})
export class ValutaPisicoComponent implements OnInit {
  @Input() data: Paziente;

  constructor() { }

  ngOnInit() {
  }

}
