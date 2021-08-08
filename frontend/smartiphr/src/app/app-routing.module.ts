import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AreaEducativaComponent } from './pages/area-educativa/area-educativa.component';
import { AreaFisioterapiaComponent } from './pages/area-fisioterapia/area-fisioterapia.component';
import { AreaInfermieristicaComponent } from './pages/area-infermieristica/area-infermieristica.component';
import { AreaMedicaComponent } from './pages/area-medica/area-medica.component';
import { OspitiComponent } from './pages/ospiti/ospiti.component';
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";

const routes: Routes = [
  { path: "ospiti", component: OspitiComponent }, // Wildcard route for a 404 page
  { path: "educativa", component: AreaEducativaComponent }, // Wildcard route for a 404 page
  { path: "pisicologica", component: PisicologicaComponent }, // Wildcard route for a 404 page
  { path: "fisioterapia", component: AreaFisioterapiaComponent }, // Wildcard route for a 404 page
  { path: "medica", component: AreaMedicaComponent }, // Wildcard route for a 404 page
  { path: "infermieristica", component: AreaInfermieristicaComponent }, // Wildcard route for a 404 page

  //  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
