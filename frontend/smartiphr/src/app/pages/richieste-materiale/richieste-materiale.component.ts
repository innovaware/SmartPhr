import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-richieste-materiale',
  templateUrl: './richieste-materiale.component.html',
  styleUrls: ['./richieste-materiale.component.css']
})
export class RichiestaMaterialeComponent implements OnInit {
  public uploading: boolean = false;
  public dipendente: Dipendenti = {} as Dipendenti;
  public admin: boolean = false;
  public type: string = '';

  constructor(
    private messageService: MessagesService,
    private dipendenteService: DipendentiService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.route.queryParams.subscribe(params => {
      const func = params.function as string;
      switch (func?.toLowerCase()) {
        case 'oss':
          this.admin = false;
          this.type = "OSS";
          break;
        case 'infermieri':
          this.admin = false;
          this.type = "Infermieri";
          break;
        case 'admin':
        default:
          this.admin = true;
          this.type = "Admin";
          break;
      }
    });

    this.loadUser();
  }

  ngOnInit(): void { }

  private loadUser(): void {
    this.authenticationService.getCurrentUserAsync().subscribe(
      user => {
        this.dipendenteService.getByIdUser(user.dipendenteID)
          .then(x => {
            this.dipendente = x[0];
          })
          .catch(err => {
            this.messageService.showMessageError(
              `Errore Caricamento dipendente (${err.status})`
            );
          });
      }
    );
  }
}
