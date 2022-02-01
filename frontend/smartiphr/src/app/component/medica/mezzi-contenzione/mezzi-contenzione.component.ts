import { Component, Input, OnInit} from '@angular/core';
import { schedaMezziContenzione } from 'src/app/models/schedaMezziContenzione';

@Component({
  selector: 'app-mezzi-contenzione',
  templateUrl: './mezzi-contenzione.component.html',
  styleUrls: ['./mezzi-contenzione.component.css']
})
export class MezziContenzioneComponent implements OnInit {

  @Input() data: schedaMezziContenzione;
  @Input() disable: boolean;

  constructor() {}

  ngOnInit() {
  }


}
