import { Component, OnInit } from '@angular/core';
import { Mansione } from 'src/app/models/mansione';
import { Menu } from 'src/app/models/menu';
import { MansioniService } from 'src/app/service/mansioni.service';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  mansioni: Mansione[];
  menu: Menu[];

  menuXmansione: { [key: string]: any } = {};

  constructor(
    private mansioniService: MansioniService,
    private menuService: MenuService,
  ) { }

  ngOnInit() {
    this.mansioniService.get().then(
      (mansioni: Mansione[]) => this.mansioni = mansioni
    );

    this.menuService.getMenu().subscribe(
      (menu: Menu[]) => {
        this.menu = menu.sort((a:Menu, b:Menu) => a.order - b.order);

        this.menu.forEach(x => {
          this.menuXmansione[x._id] = undefined;
        })
        console.log(this.menuXmansione);
      });

  }

  save() {
    this.menu.forEach(x => {
      if (this.menuXmansione[x._id] !== undefined) {
        x.roles = this.menuXmansione[x._id];
        this.menuService.update(x).subscribe(res=> {
          console.log("update res:", res);

        })
      }
    })
  }

}
