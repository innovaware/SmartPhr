import { Component, Input, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-register-information-dipendente",
  templateUrl: "./register-information-dipendente.component.html",
  styleUrls: ["./register-information-dipendente.component.css"],
})
export class RegisterInformationDipendenteComponent implements OnInit {
  @Input() data: Subject<{
    nome: string;
    cognome: string;
    email: string;
    mansione: string;
  }>;

  nome: string;
  cognome: string;
  email: string;
  mansione: string;

  constructor() {}


  ngOnInit() {
    this.data.subscribe(subscriber => {
      console.log("Dentro subscriber");

      this.nome = subscriber.nome;
      this.cognome = subscriber.cognome;
      this.email = subscriber.email;
      this.mansione = subscriber.mansione;
    })
  }
}
