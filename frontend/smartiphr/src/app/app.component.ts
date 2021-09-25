import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'smartiphr';

  viewDate: Date = new Date();
  events = [];

  constructor(
    private authenticationService: AuthenticationService,
    private route:Router
  ) {}

  async logout() {
    this.authenticationService.logout();
    this.route.navigate(["login"]);
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
}
