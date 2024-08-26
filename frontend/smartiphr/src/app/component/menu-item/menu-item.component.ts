import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() link: string;
  @Input('content-title') contentTitle: string;
  @Input('icon') icon: string;
  @Input() home: Boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigate() {
    console.log("home", this.home);
    if (this.link !== undefined && this.link !== null && this.link !== "" && (this.link !== "/" || this.home)) {
      const link = decodeURIComponent(this.link);
      const curr = window.location.pathname + window.location.search;

      // Funzione di utilità per ottenere i parametri GET come oggetto
      const getQueryParams = (url: string): URLSearchParams => {
        const searchIndex = url.indexOf('?');
        return new URLSearchParams(searchIndex !== -1 ? url.substring(searchIndex) : "");
      };

      // Ottieni i parametri GET dall'URL corrente e dall'URL di destinazione
      const currParams = getQueryParams(curr);
      const linkParams = getQueryParams(link);

      // Funzione per confrontare i parametri GET
      const areParamsDifferent = (params1: URLSearchParams, params2: URLSearchParams): boolean => {
        if (params1.toString() !== params2.toString()) {
          return true;
        }
        return false;
      };

      if (areParamsDifferent(currParams, linkParams)) {
        this.router.navigated = false;
        this.router.navigateByUrl(link).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigated = false;
        this.router.navigateByUrl(link).then(() => {
        });
      }
    }
  }
}
