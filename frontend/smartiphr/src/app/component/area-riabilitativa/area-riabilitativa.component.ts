import { Component, Input, OnInit } from '@angular/core';
import { AreaRiabilitativa } from 'src/app/models/AreaRiabilitativa';

@Component({
  selector: 'app-area-riabilitativa',
  templateUrl: './area-riabilitativa.component.html',
  styleUrls: ['./area-riabilitativa.component.css']
})
export class AreaRiabilitativaComponent implements OnInit {
  @Input() data: AreaRiabilitativa;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
