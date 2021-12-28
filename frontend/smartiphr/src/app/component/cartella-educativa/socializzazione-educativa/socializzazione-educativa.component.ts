import { Component, Input, OnInit } from '@angular/core';
import { SchedaSocializzazione } from 'src/app/models/schedaSocializzazione';

@Component({
  selector: 'app-socializzazione-educativa',
  templateUrl: './socializzazione-educativa.component.html',
  styleUrls: ['./socializzazione-educativa.component.css']
})
export class SocializzazioneEducativaComponent implements OnInit {
  @Input() data: SchedaSocializzazione;
  constructor() { }

  ngOnInit() {
  }

}
