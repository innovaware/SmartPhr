import { Component, Input, OnInit } from '@angular/core';
import { schedaDimissioneOspite } from 'src/app/models/schedaDimissioneOspite';


@Component({
  selector: 'app-dimissioni',
  templateUrl: './dimissioni.component.html',
  styleUrls: ['./dimissioni.component.css']
})
export class DimissioniComponent implements OnInit {

  @Input() data: schedaDimissioneOspite;
  constructor() { }

  ngOnInit() {
  }

}
