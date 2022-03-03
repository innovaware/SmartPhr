import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Dipendenti } from 'src/app/models/dipendenti';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DipendentiService } from 'src/app/service/dipendenti.service';
import { DocumentiService } from 'src/app/service/documenti.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-ferie-altro-personale',
  templateUrl: './ferie-altro-personale.component.html',
  styleUrls: ['./ferie-altro-personale.component.css']
})
export class FerieAltroPersonaleComponent implements OnInit {

  dipendente: Dipendenti = {} as Dipendenti;
  isExternal : boolean;
 
  constructor( public dipendenteService: DipendentiService,  
    public messageService: MessagesService,
    public uploadService: UploadService,
    public docService: DocumentiService,
    public authenticationService:AuthenticationService,
    public dialog: MatDialog) { 
      this.loadUser();
    }

  ngOnInit() {
    this.isExternal = true;
  }


  loadUser(){
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user)=>{
   
        console.log('get dipendente');
        this.dipendenteService
        .getByIdUser(user._id)
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
