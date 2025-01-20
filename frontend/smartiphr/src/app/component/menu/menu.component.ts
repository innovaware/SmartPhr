import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { Dipendenti } from "src/app/models/dipendenti";
import { Mansione } from "src/app/models/mansione";
import { Menu } from "src/app/models/menu";
import { SubMenu } from "src/app/models/subItem";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/service/authentication.service";
import { MenuService } from "src/app/service/menu.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  menu: Menu[];
  mansione: string;
  username: String;
  constructor(
    public menuService: MenuService,
    private authenticationService: AuthenticationService
  ) {
    this.username = "";
    this.menu = [];
  }

  ngOnInit() {
    this.authenticationService.getCurrentUserAsync().subscribe((user: User) => {
      if (user !== undefined && user !== null) {
        this.username = user.firma;
        console.log(user);
        this.menuService.getMenu().subscribe((items: Menu[]) => {
          this.menu = items.map((item) => {
            item.expanded = false; // Aggiungi proprietà expanded
            if (item.subMenu) {
              item.subMenu.forEach((subItem) => {
                subItem.expanded = false;
                if (subItem.subMenu) {
                  subItem.subMenu.forEach((subSubItem) => (subSubItem.expanded = false));
                }
              });
            }
            return item;
          });
        });

        const userId = user._id;
        this.authenticationService
          .getInfo(userId)
          .pipe(
            map((dipendenti: Dipendenti[]) => {
              return dipendenti.map((dip: Dipendenti) => {
                return {
                  ...dip,
                  mansione: dip.mansione ? dip.mansione[0] : ''
                }
              })
            })
          )
          .subscribe((dipendente: Dipendenti[]) => {
            //console.log("Dipendente get Info", dipendente);

            if (dipendente.length === 1) {
              this.mansione = (dipendente[0].mansione as unknown as Mansione).descrizione;
            }
          });
      }
    });
  }

  // Metodo chiamato quando un pannello viene chiuso
  onPanelClose(menuItem: Menu | SubMenu) {
    menuItem.expanded = false;

    if (menuItem.subMenu) {
      menuItem.subMenu.forEach((subItem) => {
        subItem.expanded = false;
        if (subItem.subMenu) {
          this.onPanelClose(subItem); // Chiudi ricorsivamente
        }
      });
    }
  }

  // Metodo chiamato quando un pannello viene aperto
  onPanelOpen(menuItem: Menu | SubMenu) {
    menuItem.expanded = true;
  }

  closeAllSubItem(subMenu: SubMenu[]) {
    console.log("Close All sub Items");

    subMenu.map((x) => (x.status = false));
  }
}
