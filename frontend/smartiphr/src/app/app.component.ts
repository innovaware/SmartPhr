import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Paziente } from "./models/paziente";
import { AuthenticationService } from "./service/authentication.service";
import { PazienteService } from "./service/paziente.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "smartiphr";

  viewDate: Date = new Date();
  events = [];

  constructor(
    private authenticationService: AuthenticationService,
    private route: Router,

    private pazienteService: PazienteService,
    private http: HttpClient
  ) {}

  async logout() {
    this.authenticationService.logout();
    this.route.navigate(["login"]);
  }

  demo() {
    console.log("demo");
    for (let index = 0; index < 100; index++) {
      this.http.get(`https://randomuser.me/api`).subscribe((r) => {
        let patient: Paziente = new Paziente();
        let data = r["results"][0];
        patient.cognome = data.name.last;
        patient.nome = data.name.first;
        patient.sesso = data.name.gender == "female" ? "F" : "M";
        patient.indirizzoResidenza = data.location.street.name;
        patient.comuneResidenza = data.location.city;
        patient.provinciaResidenza = data.location.state;
        patient.dataNascita = data.dob.date;
        patient.telefono = data.phone;
        console.log(patient);

        this.pazienteService.insert(patient).then((x) => {
          console.log("Insert");
        });
      });
    }
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
}
