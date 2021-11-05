import { Component, Input, OnInit} from '@angular/core';
import { schedaEsameGenerale } from 'src/app/models/schedaEsameGenerale';

@Component({
  selector: 'app-esame-generale',
  templateUrl: './esame-generale.component.html',
  styleUrls: ['./esame-generale.component.css']
})
export class EsameGeneraleComponent implements OnInit {
  @Input() data: schedaEsameGenerale;

  constructor() {}

  ngOnInit() {
  }
}
