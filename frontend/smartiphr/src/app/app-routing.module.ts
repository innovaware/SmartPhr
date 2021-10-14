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
import { FattureFornitoriComponent } from "./pages/fatture-fornitori/fatture-fornitori.component";
import { BonificiFornitoriComponent } from "./pages/bonifici-fornitori/bonifici-fornitori.component";
import { GestStanzeComponent } from "./pages/gest-stanze/gest-stanze.component";
import { GestUtentiComponent } from "./pages/gest-utenti/gest-utenti.component";
import { LoginComponent } from './pages/login/login.component';
import { OspitiComponent } from "./pages/ospiti/ospiti.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";

const routes: Routes = [
  { path: "login", component: DashboardComponent },

  { path: "ospiti", component: OspitiComponent },
  { path: "educativa", component: AreaEducativaComponent },
  { path: "pisicologica", component: PisicologicaComponent },
  { path: "fisioterapia", component: AreaFisioterapiaComponent },
  { path: "medica", component: AreaMedicaComponent },
  { path: "infermieristica", component: AreaInfermieristicaComponent },

  { path: "gest_pazienti", component: AdminPazientiComponent, canActivate: [AuthGuard] },

// PERSONALE
  { path: "gest_dipendenti", component: GestUtentiComponent },
  { path: "gest_ferie", component: FerieComponent },
  { path: "gest_permessi", component: PermessiComponent },
  { path: "gest_cambiturno", component: CambiturnoComponent },
  { path: "gest_presenze", component: PresenzeComponent },
  { path: "gest_turnimensili", component: TurnimensiliComponent },




  { path: "gest_consulenti", component: ConsulentiComponent },
  { path: "gest_fornitori", component: AdminFornitoriComponent, canActivate: [AuthGuard] },
  { path: "fatture_fornitori", component: FattureFornitoriComponent, canActivate: [AuthGuard] },
  { path: "bonifici_fornitori", component: BonificiFornitoriComponent, canActivate: [AuthGuard] },
  { path: "gest_asp", component: AspComponent },
  { path: "gest_stanze", component: GestStanzeComponent },
  { path: "gest_farmaci", component: FarmaciComponent },

  { path: "gest_presidi", component: PagenotfoundComponent },
  { path: "gest_carrello", component: PagenotfoundComponent },

  { path: "", component: DashboardComponent },

  { path: "**", component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
