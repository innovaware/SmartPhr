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
import { SettingsService } from '../../service/settings.service';
import { Settings } from '../../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {


  public uploading: boolean;
  dipendente: Dipendenti = {} as Dipendenti;

  public Regolamento: String;
  public setting: Settings;



  constructor(public messageService: MessagesService, public docService: DocumentiService,
    public uploadService: UploadService, public dipendenteService: DipendentiService, public authenticationService: AuthenticationService,
    public mansioniService: MansioniService,
    public settingService: SettingsService) {
    this.setting = new Settings();
    this.setting.alertContratto = 0;
    this.setting.alertFarmaci = 0;
    this.setting.alertDiarioClinico = 0;
    this.loadUser();
    this.getSettings();
    this.Regolamento = "RegolamentoInterno";
  }

  ngOnInit() {

    this.getSettings();
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

  getSettings() {
    this.settingService.getSettings().then((res) => {
      this.setting = res[0];
    })
  }

  updateSettings()
  {
    if (!this.setting.alertDiarioClinico) this.setting.alertDiarioClinico = 0;
    if (!this.setting.alertContratto) this.setting.alertContratto = 0;
    if (!this.setting.alertFarmaci) this.setting.alertFarmaci = 0;
    //if (!this.setting.ScadenzaPersonalizzato) this.setting.ScadenzaPersonalizzato = 0;
    this.setting.alertContratto = Math.abs(this.setting.alertContratto.valueOf());
    this.setting.alertFarmaci = Math.abs(this.setting.alertFarmaci.valueOf());
    this.setting.alertDiarioClinico = Math.abs(this.setting.alertDiarioClinico.valueOf());
    //this.setting.ScadenzaPersonalizzato = Math.abs(this.setting.ScadenzaPersonalizzato.valueOf());
    this.settingService.updateSettings(this.setting).then(() => {
      this.messageService.showMessage("Impostazioni Aggiornate");
    });
  }

}
