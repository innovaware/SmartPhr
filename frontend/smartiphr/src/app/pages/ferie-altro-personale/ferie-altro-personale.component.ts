import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Dipendenti } from 'src/app/models/dipendenti';
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
    public dialog: MatDialog) { 
      this.loadUser();
    }

  ngOnInit() {
    this.isExternal = true;
  }


  loadUser(){
    this.dipendenteService
    .getById('620027d56c8df442a73341fa')
    .then((x) => {
          this.dipendente = x;
    })
    .catch((err) => {
      this.messageService.showMessageError(
        "Errore Caricamento dipendente (" + err["status"] + ")"
      );
    });
  }
}
