import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menu: Menu[];

  constructor(
    public menuService: MenuService
  ) {
    this.menu = [];
  }

  ngOnInit() {
    this.menuService.getMenu()
      .subscribe( (items: Menu[])=> {
        this.menu = items.sort((a: Menu, b: Menu)=> a.order - b.order);
        console.log("Menu", this.menu);
      });
  }

}
