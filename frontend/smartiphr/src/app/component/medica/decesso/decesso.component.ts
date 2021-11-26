import { Component, Input, OnInit } from '@angular/core';
import { schedaDecessoOspite } from 'src/app/models/schedaDecessoOspite';

@Component({
  selector: 'app-decesso',
  templateUrl: './decesso.component.html',
  styleUrls: ['./decesso.component.css']
})
export class DecessoComponent implements OnInit {

  @Input() data: schedaDecessoOspite;
  constructor() { }

  ngOnInit() {
  }

}
