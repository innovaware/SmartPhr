import { Component, OnInit } from '@angular/core';
import { Dipendenti } from '../../models/dipendenti';
import { AuthenticationService } from '../../service/authentication.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { MessagesService } from '../../service/messages.service';

@Component({
  selector: 'app-calendario-turni',
  templateUrl: './calendario-turni.component.html',
  styleUrls: ['./calendario-turni.component.css']
})
export class calendarioTurniComponent implements OnInit {

  dipendente: Dipendenti;
  isTurni: boolean = true;
  constructor(public authenticationService: AuthenticationService,
    public dipendenteService: DipendentiService,
    public messageService: MessagesService
  ) {
    this.isTurni = true;
    this.loadUser();
}

  ngOnInit() {
    this.isTurni = true;
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
