import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AreaEducativaComponent } from "./pages/area-educativa/area-educativa.component";
import { AreaFisioterapiaComponent } from "./pages/area-fisioterapia/area-fisioterapia.component";
import { AreaInfermieristicaComponent } from "./pages/area-infermieristica/area-infermieristica.component";
import { AreaMedicaComponent } from "./pages/area-medica/area-medica.component";
import { AspComponent } from "./pages/asp/asp.component";
import { ConsulentiComponent } from "./pages/consulenti/consulenti.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { FarmaciComponent } from "./pages/farmaci/farmaci.component";
import { FornitoriComponent } from "./pages/fornitori/fornitori.component";
import { GestStanzeComponent } from "./pages/gest-stanze/gest-stanze.component";
import { GestUtentiComponent } from "./pages/gest-utenti/gest-utenti.component";
import { OspitiComponent } from "./pages/ospiti/ospiti.component";
import { PagenotfoundComponent } from "./pages/pagenotfound/pagenotfound.component";
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";

const routes: Routes = [
  { path: "ospiti", component: OspitiComponent },
  { path: "educativa", component: AreaEducativaComponent },
  { path: "pisicologica", component: PisicologicaComponent },
  { path: "fisioterapia", component: AreaFisioterapiaComponent },
  { path: "medica", component: AreaMedicaComponent },
  { path: "infermieristica", component: AreaInfermieristicaComponent },

  { path: "gest_pazienti", component: PagenotfoundComponent },
  { path: "gest_dipendenti", component: GestUtentiComponent },
  { path: "gest_consulenti", component: ConsulentiComponent },
  { path: "gest_fornitori", component: FornitoriComponent },
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
