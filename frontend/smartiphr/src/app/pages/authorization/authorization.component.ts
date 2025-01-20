import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Mansione } from 'src/app/models/mansione';
import { Menu } from 'src/app/models/menu';
import { MansioniService } from 'src/app/service/mansioni.service';
import { MenuService } from 'src/app/service/menu.service';
import { MessagesService } from '../../service/messages.service';
import { AuthenticationService } from '../../service/authentication.service';

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
    private AuthServ: AuthenticationService
  ) {
    this.mansioni = [];
    this.menu = [];
  }

  ngOnInit() {
    this.mansioni = [];
    this.menu = [];
    this.mansioniService.get().then(
      (mansioni: Mansione[]) => {
        if (this.AuthServ.getCurrentUser().role == "66aa1532b6f9db707c1c2010") this.mansioni = mansioni;
        else this.mansioni = mansioni.filter(x => x.codice.toLowerCase() !="sa");
      }
    );

    this.menuService.getMenuAccess().subscribe(
      (menu: Menu[]) => {
        if (this.AuthServ.getCurrentUser().role == "66aa1532b6f9db707c1c2010") this.menu = menu.sort((a: Menu, b: Menu) => a.order - b.order);
        else this.menu = menu.filter(x => x.active).sort((a: Menu, b: Menu) => a.order - b.order);

        this.menu.forEach(x => {
          this.menuXmansione[x._id] = x.roles;
         
        })
        //console.log(this.menuXmansione);
      });

  }

  save() {
    const hiddenRoleId = "66aa1532b6f9db707c1c2010"; // Sostituisci con l'ObjectId reale della mansione specifica

    this.menu.forEach(menu => {
      const updatedMenu = { ...menu }; // Clona l'oggetto menu
      console.log("Menu: ", menu);
      console.log("UPMenu: ", updatedMenu);

      // Se la chiave _id del menu è presente in menuXmansione
      if (this.menuXmansione[menu._id] !== undefined) {
        // Aggiungi l'ObjectId nascosto se non già presente
        if (!this.menuXmansione[menu._id].includes(hiddenRoleId)) {
          this.menuXmansione[menu._id].push(hiddenRoleId);
        }

        // Aggiorna i ruoli del menu con l'array modificato
        updatedMenu.roles = this.menuXmansione[menu._id];

        // Salva l'aggiornamento sul server
        this.menuService.update(updatedMenu).subscribe(res => {
          console.log("Menu aggiornato:", res);
        });
      }
    });

    this.messServ.showMessage("Salvataggio Effettuato");
  }




}
