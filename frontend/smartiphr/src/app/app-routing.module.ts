import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CambiturnoComponent } from "./component/cambiturno/cambiturno.component";
import { FerieComponent } from "./component/ferie/ferie.component";
import { PermessiComponent } from "./component/permessi/permessi.component";
import { PresenzeComponent } from "./component/presenze/presenze.component";
import { TurnimensiliComponent } from "./component/turnimensili/turnimensili.component";
import { AuthGuardService as AuthGuard } from './guard/auth-guard.service';
import { AdminPazientiComponent } from './pages/admin-pazienti/admin-pazienti.component';
import { AreaEducativaComponent } from "./pages/area-educativa/area-educativa.component";
import { AreaFisioterapiaComponent } from "./pages/area-fisioterapia/area-fisioterapia.component";
import { AreaInfermieristicaComponent } from "./pages/area-infermieristica/area-infermieristica.component";
import { AreaMedicaComponent } from "./pages/area-medica/area-medica.component";
import { AspComponent } from "./pages/asp/asp.component";
import { ConsulentiComponent } from "./pages/consulenti/consulenti.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FarmaciComponent } from "./pages/farmaci/farmaci.component";
import { AdminFornitoriComponent } from "./pages/admin-fornitori/admin-fornitori.component";
import { GestStanzeComponent } from "./pages/gest-stanze/gest-stanze.component";
import { GestUtentiComponent } from "./pages/gest-utenti/gest-utenti.component";
import { LoginComponent } from './pages/login/login.component';
import { OspitiComponent } from "./pages/ospiti/ospiti.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";
import { CvComponent } from './pages/cv/cv.component';
import { FattureConsulentiComponent } from './pages/fatture-consulenti/fatture-consulenti.component';
import { BonificiConsulentiComponent } from './pages/bonifici-consulenti/bonifici-consulenti.component';
import { FattureFornitoriComponent } from './pages/fatture-fornitori/fatture-fornitori.component';
import { BonificiFornitoriComponent } from './pages/bonifici-fornitori/bonifici-fornitori.component';
import { FattureSSRComponent } from './pages/fatture-ssr/fatture-ssr.component';
import { FattureSSComponent } from './pages/fatture-ss/fatture-ss.component';


import { AnticipoFattureASPComponent } from './pages/anticipo-fatture-asp/anticipo-fatture-asp.component';
import { NoteCreditoASPComponent } from './pages/note-credito-asp/note-credito-asp.component';
import { ProspettoCMASPComponent } from './pages/prospetto-cm-asp/prospetto-cm-asp.component';
import { PuntoFattureASPComponent } from './pages/punto-fatture-asp/punto-fatture-asp.component';
import { ArchiviVisiteSpecialisticheComponent } from './pages/archivi/archivi-visite-specialistiche/archivi-visite-specialistiche.component';
import { ArchiviEsitoStrumentaleComponent } from './pages/archivi/archivi-esito-strumentale/archivi-esito-strumentale.component';
import { ArchiviRefertiEmatochimiciComponent } from './pages/archivi/archivi-referti-ematochimici/archivi-referti-ematochimici.component';
import { ArchiviVerbaliComponent } from './pages/archivi/archivi-verbali/archivi-verbali.component';
import { ArchiviRelazioniCertificatiComponent } from './pages/archivi/archivi-relazioni-certificati/archivi-relazioni-certificati.component';
import { ArchiviImpegnativeComponent } from './pages/archivi/archivi-impegnative/archivi-impegnative.component';
import { ArchiviPAIComponent } from './pages/archivi/archivi-pai/archivi-pai.component';
import { AreaSocialeComponent } from "./pages/area-sociale/area-sociale.component";
import { RegisterComponent } from './pages/register/register.component';

import { EsamiPrivacyPersonaleComponent } from "./pages/esami-privacy-personale/esami-privacy-personale.component";
import { FerieAltroPersonaleComponent } from "./pages/ferie-altro-personale/ferie-altro-personale.component";
import { LavoroPersonaleComponent } from "./pages/lavoro-personale/lavoro-personale.component";
import { GeneralePersonaleComponent } from "./pages/generale-personale/generale-personale.component";
import { AuthorizationComponent } from "./pages/authorization/authorization.component";
import { CamereComponent } from "./pages/camere/camere.component";



import { AreaOssComponent } from "./pages/area-oss/area-oss.component";
import { AttivitaOssComponent } from "./pages/attivita-oss/attivita-oss.component";
import { RegistroControlliOssComponent } from "./pages/registro-controlli-oss/registro-controlli-oss.component";
import { CamereListComponent } from "./pages/camere-list/camere-list.component";
import { CamereMapComponent } from "./pages/camere-map/camere-map.component";
import { SanificazioneListComponent } from "./pages/sanificazione-list/sanificazione-list.component";
import { SanificazioneRegistroComponent } from "./pages/sanificazione-registro/sanificazione-registro.component";
import { ArmadiListComponent } from "./pages/armadi-list/armadi-list.component";
import { IndumentiListComponent } from "./pages/indumenti-list/indumenti-list.component";


import { ChiaviOssComponent } from './pages/chiavi-oss/chiavi-oss.component';
import { RifacimentoLettiOssComponent } from "./pages/rifacimento-letti-oss/rifacimento-letti-oss.component";
import { GestFarmaciComponent } from "./pages/gest-farmaci/gest-farmaci.component";
import { GestPresidiComponent } from "./pages/gest-presidi/gest-presidi.component";
import { GestFarmacipresidiPazientiComponent } from "./pages/gest-farmacipresidi-pazienti/gest-farmacipresidi-pazienti.component";
import { ModulisticafarmaciComponent } from "./pages/modulisticafarmaci/modulisticafarmaci.component";
import { AttivitaFarmaciComponent } from "./pages/attivita-farmaci/attivita-farmaci.component";
import { AreaPaiComponent } from "./pages/area-pai/area-pai.component";
import { GestionePuliziaAmbientiComponent } from "./pages/gestione-pulizia-ambienti/gestione-pulizia-ambienti.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent},

  { path: "ospiti", component: OspitiComponent, canActivate: [AuthGuard]  },
  { path: "educativa", component: AreaEducativaComponent, canActivate: [AuthGuard]  },
  { path: "pisicologica", component: PisicologicaComponent, canActivate: [AuthGuard]  },
  { path: "fisioterapia", component: AreaFisioterapiaComponent, canActivate: [AuthGuard]  },
  { path: "medica", component: AreaMedicaComponent, canActivate: [AuthGuard]  },
  { path: "infermieristica", component: AreaInfermieristicaComponent, canActivate: [AuthGuard]  },

  // CARTELLA ASS.SOCIALE
  { path: "assistente-sociale", component: AreaSocialeComponent, canActivate: [AuthGuard]  },

  // PERSONALE
  { path: "gest_dipendenti", component: GestUtentiComponent, canActivate: [AuthGuard]  },
  { path: "gest_ferie", component: FerieComponent, canActivate: [AuthGuard]  },
  { path: "gest_permessi", component: PermessiComponent, canActivate: [AuthGuard]  },
  { path: "gest_cambiturno", component: CambiturnoComponent, canActivate: [AuthGuard]  },
  { path: "gest_presenze", component: PresenzeComponent, canActivate: [AuthGuard]  },
  { path: "gest_turnimensili", component: TurnimensiliComponent, canActivate: [AuthGuard]  },

  // AREA PERSONALE
  { path: "generale", component: GeneralePersonaleComponent, canActivate: [AuthGuard]  },
  { path: "cert_privacy", component: EsamiPrivacyPersonaleComponent, canActivate: [AuthGuard]  },
  { path: "lavoro", component: LavoroPersonaleComponent, canActivate: [AuthGuard]  },
  { path: "ferie_permessi", component: FerieAltroPersonaleComponent, canActivate: [AuthGuard]  },

  // PAI
  { path: "pai", component: AreaPaiComponent, canActivate: [AuthGuard]  },

  // AREA OSS
  { path: "gest_pazienti_oss", component: AreaOssComponent, canActivate: [AuthGuard]  },
  { path: "attivita_oss", component: AttivitaOssComponent, canActivate: [AuthGuard]  },
  { path: "gest_chiavi", component: ChiaviOssComponent, canActivate: [AuthGuard]  },
  { path: "rifacimento_letti", component: RifacimentoLettiOssComponent, canActivate: [AuthGuard]  },

  // AMMINISTRAZIONE
  { path: "authorization", component: AuthorizationComponent, canActivate: [AuthGuard] },
  { path: "gest_pazienti", component: AdminPazientiComponent, canActivate: [AuthGuard] },
  { path: "gest_consulenti", component: ConsulentiComponent, canActivate: [AuthGuard] },
  { path: "fatture_consulenti", component: FattureConsulentiComponent, canActivate: [AuthGuard] },
  { path: "bonifici_consulenti", component: BonificiConsulentiComponent, canActivate: [AuthGuard] },
  { path: "gest_fornitori", component: AdminFornitoriComponent, canActivate: [AuthGuard] },
  { path: "fatture_fornitori", component: FattureFornitoriComponent, canActivate: [AuthGuard] },
  { path: "bonifici_fornitori", component: BonificiFornitoriComponent, canActivate: [AuthGuard] },

  { path: "fatture_ssr", component: FattureSSRComponent, canActivate: [AuthGuard] },
  { path: "fatture_ss", component: FattureSSComponent, canActivate: [AuthGuard] },

  { path: "anticipi_fatture_asp", component: AnticipoFattureASPComponent, canActivate: [AuthGuard] },
  { path: "note_credito_asp", component: NoteCreditoASPComponent, canActivate: [AuthGuard] },
  { path: "prospetto_mensile_asp", component: ProspettoCMASPComponent, canActivate: [AuthGuard] },
  { path: "punto_fatture_asp", component: PuntoFattureASPComponent, canActivate: [AuthGuard] },

  { path: "gest_asp", component: AspComponent, canActivate: [AuthGuard]  },
  { path: "gest_cv", component: CvComponent, canActivate: [AuthGuard]  },

  { path: "gest_stanze", component: GestStanzeComponent, canActivate: [AuthGuard]  },
  { path: "gest_farmaci", component: FarmaciComponent, canActivate: [AuthGuard]  },

  { path: "gest_presidi", component: PagenotfoundComponent, canActivate: [AuthGuard]  },
  { path: "gest_carrello", component: PagenotfoundComponent, canActivate: [AuthGuard]  },

  // CAMERE
  { path: "gest_camere", component: CamereComponent, canActivate: [AuthGuard]  },
  { path: "gest_camerelist", component: CamereListComponent, canActivate: [AuthGuard]  },
  { path: "gest_camere_map", component: CamereMapComponent, canActivate: [AuthGuard]  },

  // SANIFICAZIONE
  { path: "gest_sanificazioneList", component: SanificazioneListComponent, canActivate: [AuthGuard]  },
  { path: "registro_sanificazione", component: SanificazioneRegistroComponent, canActivate: [AuthGuard]  },

  // ARMADI
  { path: "gest_armadiList", component: ArmadiListComponent, canActivate: [AuthGuard]  },
  { path: "gest_armadi_controlli", component: RegistroControlliOssComponent, canActivate: [AuthGuard]  },

  // INDUMENTI
  { path: "gest_indumenti", component: IndumentiListComponent, canActivate: [AuthGuard]  },


  // ARCHIVI
  { path: "archio_visitespecialistiche", component: ArchiviVisiteSpecialisticheComponent, canActivate: [AuthGuard]  },
  { path: "archivio_esami_strumentali", component: ArchiviEsitoStrumentaleComponent, canActivate: [AuthGuard]  },
  { path: "archivio_referti_ematochimici", component: ArchiviRefertiEmatochimiciComponent, canActivate: [AuthGuard]  },
  { path: "archivio_verbali", component: ArchiviVerbaliComponent, canActivate: [AuthGuard]  },
  { path: "archivio_relazioni_certificati", component: ArchiviRelazioniCertificatiComponent, canActivate: [AuthGuard]  },
  { path: "archivio_impegnative", component: ArchiviImpegnativeComponent, canActivate: [AuthGuard]  },
  { path: "archivio_pai", component: ArchiviPAIComponent, canActivate: [AuthGuard]  },



  //GEST FARMACI
  { path: "gest-farmaci", component: GestFarmaciComponent, canActivate: [AuthGuard]  },
  { path: "gest-presidi", component: GestPresidiComponent, canActivate: [AuthGuard]  },
  { path: "gest_farmacipresidi", component: GestFarmacipresidiPazientiComponent, canActivate: [AuthGuard]  },
  { path: "gest-registro", component: AttivitaFarmaciComponent, canActivate: [AuthGuard]  },
  { path: "modulistica-farmaci", component: ModulisticafarmaciComponent, canActivate: [AuthGuard]  },


  //AREA AUSILIARI
  { path: "gest-pulizia-ambienti", component: GestionePuliziaAmbientiComponent, canActivate: [AuthGuard]  },


  { path: "", component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: "**", component: PagenotfoundComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
