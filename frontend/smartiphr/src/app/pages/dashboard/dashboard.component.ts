import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { MessagesService } from '../../service/messages.service';
import { Dipendenti } from '../../models/dipendenti';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dipendente: Dipendenti;
  isTurni: boolean;

  constructor(public dipendenteService: DipendentiService,
    public messageService: MessagesService,
    public authenticationService: AuthenticationService) {
    this.loadUser();
  }

  ngOnInit() {
    this.isTurni = false;
  }


  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        this.dipendenteService
          .getByIdUser(user.dipendenteID)
          .then((x) => {
            this.dipendente = x[0];
          })
          .catch((err) => {
            this.messageService.showMessageError(
              "Errore Caricamento dipendente (" + err["status"] + ")"
            );
          });
      });
  }
}
