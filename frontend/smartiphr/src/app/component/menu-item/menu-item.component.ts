import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
  @Input() link: string;
  @Input('content-title') contentTitle: string;
  @Input('icon') icon: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigate() {
    const link = decodeURIComponent(this.link);
    console.log("LINK:", link);

    this.router.navigated = false;
    this.router.navigateByUrl(link);
  }

}
