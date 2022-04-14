import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() link: string;
  @Input('content-title') contentTitle: string;
  @Input('icon') icon: string;

  constructor() { }

  ngOnInit() {
  }

}
