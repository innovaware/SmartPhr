import { Component, Input, OnInit} from '@angular/core';
import { schedaAnamnesiFamigliare } from 'src/app/models/schedaAnamnesiFamigliare';


@Component({
  selector: 'app-anamnesi-famigliare',
  templateUrl: './anamnesi-famigliare.component.html',
  styleUrls: ['./anamnesi-famigliare.component.css']
})
export class AnamnesiFamigliareComponent implements OnInit {

  @Input() data: schedaAnamnesiFamigliare;

  constructor() {}

  ngOnInit() {
  }
  
}
