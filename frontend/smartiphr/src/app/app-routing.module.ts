import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AreaEducativaComponent } from './pages/area-educativa/area-educativa.component';
import { AreaFisioterapiaComponent } from './pages/area-fisioterapia/area-fisioterapia.component';
import { AreaInfermieristicaComponent } from './pages/area-infermieristica/area-infermieristica.component';
import { AreaMedicaComponent } from './pages/area-medica/area-medica.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GestStanzeComponent } from './pages/gest-stanze/gest-stanze.component';
import { GestUtentiComponent } from './pages/gest-utenti/gest-utenti.component';
import { OspitiComponent } from './pages/ospiti/ospiti.component';
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";

const routes: Routes = [
  { path: "ospiti", component: OspitiComponent },
  { path: "educativa", component: AreaEducativaComponent },
  { path: "pisicologica", component: PisicologicaComponent },
  { path: "fisioterapia", component: AreaFisioterapiaComponent },
  { path: "medica", component: AreaMedicaComponent },
  { path: "infermieristica", component: AreaInfermieristicaComponent },
  { path: "gest_utenti", component: GestUtentiComponent },
  { path: "gest_stanze", component: GestStanzeComponent },
  { path: "", component: DashboardComponent },

  //  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
