import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Mansione } from 'src/app/models/mansione';
import { Menu } from 'src/app/models/menu';
import { MansioniService } from 'src/app/service/mansioni.service';
import { MenuService } from 'src/app/service/menu.service';
import { MessagesService } from '../../service/messages.service';

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
    private messServ: MessagesService,
  ) {
    this.mansioni = [];
    this.menu = [];
  }

  ngOnInit() {
    this.mansioni = [];
    this.menu = [];
    this.mansioniService.get().then(
      (mansioni: Mansione[]) => this.mansioni = mansioni
    );

    this.menuService.getMenuAccess().subscribe(
      (menu: Menu[]) => {
        this.menu = menu.sort((a:Menu, b:Menu) => a.order - b.order);

        this.menu.forEach(x => {
          this.menuXmansione[x._id] = x.roles;
        })
        //console.log(this.menuXmansione);
      });

  }

  save() {
    this.menu.forEach(menu => {
      const updatedMenu = { ...menu };  // Clona l'oggetto menu, inclusi i sottomenu
      console.log("Menu: ", menu);
      console.log("UPMenu: ", updatedMenu);

      if (this.menuXmansione[menu._id] !== undefined) {
        updatedMenu.roles = this.menuXmansione[menu._id];

        this.menuService.update(updatedMenu).subscribe(res => {
          console.log("Menu aggiornato:", res);
        });
      }
    });
    this.messServ.showMessage("Salvataggio Effettuato");
  }



}
