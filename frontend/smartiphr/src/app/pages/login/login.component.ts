import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route:Router,
    public auth: AuthenticationService
  ) {
    console.log("SONO LOGIN");
   }

  ngOnInit() {

  }

  async access() {
    const currentUser: User = {
      group: "",
      username: "dan",
      password: "dan",
      active: true,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));


    this.route.navigate([""]);
  }
}
