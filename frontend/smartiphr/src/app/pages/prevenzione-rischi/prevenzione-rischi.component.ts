import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DocumentoDipendente } from 'src/app/models/documentoDipendente';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';
import { MansioniService } from '../../service/mansioni.service';

@Component({
  selector: 'app-prevenzione-rischi',
  templateUrl: './prevenzione-rischi.component.html',
  styleUrls: ['./prevenzione-rischi.component.css']
})
export class PrevenzioneRischiComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  DisplayedColumns: string[] = ["namefile", "date", "dataScadenza", "note", "action"];



  public Certificato: String;




  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService) {
    this.loadUser();
    this.Certificato = "AS-DVR";
  }

  ngOnInit() {
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {

        console.log('get dipendente');
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
