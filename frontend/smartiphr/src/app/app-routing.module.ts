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
import { FattureFornitoriComponent } from './pages/fatture-fornitori/fatture-fornitori.component';
import { BonificiFornitoriComponent } from './pages/bonifici-fornitori/bonifici-fornitori.component';
import { FattureSSRComponent } from './pages/fatture-ssr/fatture-ssr.component';
import { FattureSSComponent } from './pages/fatture-ss/fatture-ss.component';


import { AnticipoFattureASPComponent } from './pages/anticipo-fatture-asp/anticipo-fatture-asp.component';
import { NoteCreditoASPComponent } from './pages/note-credito-asp/note-credito-asp.component';
import { ProspettoCMASPComponent } from './pages/prospetto-cm-asp/prospetto-cm-asp.component';
import { PuntoFattureASPComponent } from './pages/punto-fatture-asp/punto-fatture-asp.component';
import { VisiteSpecialisticheComponent } from './component/medica/visite-specialistiche/visite-specialistiche.component';
import { ArchiviVisiteSpecialisticheComponent } from './pages/archivi/archivi-visite-specialistiche/archivi-visite-specialistiche.component';
import { ArchiviEsitoStrumentaleComponent } from './pages/archivi/archivi-esito-strumentale/archivi-esito-strumentale.component';
import { ArchiviRefertiEmatochimiciComponent } from './pages/archivi/archivi-referti-ematochimici/archivi-referti-ematochimici.component';
import { ArchiviVerbaliComponent } from './pages/archivi/archivi-verbali/archivi-verbali.component';
import { ArchiviRelazioniCertificatiComponent } from './pages/archivi/archivi-relazioni-certificati/archivi-relazioni-certificati.component';
import { ArchiviImpegnativeComponent } from './pages/archivi/archivi-impegnative/archivi-impegnative.component';
import { ArchiviPAIComponent } from './pages/archivi/archivi-pai/archivi-pai.component';
import { cartellaAssSociale } from "./models/cartellaAssSociale";
import { AreaSocialeComponent } from "./pages/area-sociale/area-sociale.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },

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



// AMMINISTRAZIONE
  { path: "gest_pazienti", component: AdminPazientiComponent, canActivate: [AuthGuard] },
  { path: "gest_consulenti", component: ConsulentiComponent, canActivate: [AuthGuard] },
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




  // ARCHIVI
  { path: "archio_visitespecialistiche", component: ArchiviVisiteSpecialisticheComponent, canActivate: [AuthGuard]  },
  { path: "archivio_esami_strumentali", component: ArchiviEsitoStrumentaleComponent, canActivate: [AuthGuard]  },
  { path: "archivio_referti_ematochimici", component: ArchiviRefertiEmatochimiciComponent, canActivate: [AuthGuard]  },
  { path: "archivio_verbali", component: ArchiviVerbaliComponent, canActivate: [AuthGuard]  },
  { path: "archivio_relazioni_certificati", component: ArchiviRelazioniCertificatiComponent, canActivate: [AuthGuard]  },
  { path: "archivio_impegnative", component: ArchiviImpegnativeComponent, canActivate: [AuthGuard]  },
  { path: "archivio_pai", component: ArchiviPAIComponent, canActivate: [AuthGuard]  },

  { path: "", component: DashboardComponent, canActivate: [AuthGuard]  },

  { path: "**", component: PagenotfoundComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
