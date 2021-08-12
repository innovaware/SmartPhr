import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mezzi-contenzione',
  templateUrl: './mezzi-contenzione.component.html',
  styleUrls: ['./mezzi-contenzione.component.css']
})
export class MezziContenzioneComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
